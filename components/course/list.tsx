"use client";
import Course from "@/utils/types";
import React, { useState, useEffect } from "react";
import courses from "@/content/courses";
import Image from "next/image";
import Link from "next/link";
import CourseModal from "@/components/common/Modal"; // Make sure the modal is imported
import { useWeb3 } from "@/Providers";

export default function List({ button = false }: { button?: boolean }) {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selected, setSelected] = useState<Course | undefined>(); // Allow undefined initially
  const { account, isSupported, EthPrice, contract } = useWeb3();

  const [ownershipStatus, setOwnershipStatus] = useState<{
    [key: string]: boolean;
  }>({}); // State for ownership status

  useEffect(() => {
    const checkOwnership = async () => {
      if (!account) return; // No account, no need to check

      try {
        const ownershipChecks = await Promise.all(
          courses.map(async (course) => {
            const response = await fetch(
              `${window.location.origin}/api/check-ownership?account=${account}&courseId=${course.id}`
            );
            const data = await response.json();
            return { courseId: course.id, isOwner: data.isOwner };
          })
        );

        // Map the ownership checks to an object for easier access
        const ownershipMap = ownershipChecks.reduce(
          (acc, { courseId, isOwner }) => {
            acc[courseId] = isOwner;
            return acc;
          },
          {} as { [key: string]: boolean }
        );

        setOwnershipStatus(ownershipMap); // Update state with ownership information
      } catch (error) {
        console.error("Error checking ownership:", error);
      }
    };

    checkOwnership(); // Call the checkOwnership function
  }, [account]); // Re-run effect when account changes

  return (
    <section className="grid grid-cols-2 gap-4 mb-5">
      {courses.map((course) => {
        const isOwner = ownershipStatus[course.id]; // Check ownership status for this course

        return (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0 relative min-h-72 w-48">
                <Image
                  className={`object-cover ${
                    !isSupported && button ? "filter grayscale" : ""
                  }`}
                  src={course.coverImage}
                  alt={course.title}
                  fill
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {course.type}
                </div>
                <a className="block mt-1 text-lg leading-tight font-medium text-black ">
                  {course.title}
                </a>
                <p className="mt-2 mb-5 text-gray-500">{course.description}</p>
                {button ? (
                  <>
                    {isOwner ? ( // If the user is the owner, show the View button
                      <Link
                        href={`/course/${course.id}`}
                        className="mt-4 px-3 py-2 text-white rounded-lg bg-blue-600"
                      >
                        View
                      </Link>
                    ) : (
                      <button
                        className={`mt-4 px-3 py-2 text-white rounded-lg ${
                          isSupported
                            ? "bg-purple-600"
                            : "bg-red-600 opacity-50"
                        }`}
                        onClick={() => {
                          setShowModal(true);
                          setSelected(course);
                        }}
                        disabled={!isSupported}
                      >
                        {isSupported ? "Purchase" : "Unavailable"}
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {/* Render the modal only if selected is defined */}
      {showModal && selected && (
        <CourseModal
          showModal={showModal}
          setShowModal={setShowModal}
          course={selected}
          address={account}
          EthPrice={EthPrice}
          contract={contract}
        />
      )}
    </section>
  );
}
