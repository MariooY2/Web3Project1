"use client";

import { useWeb3 } from "@/Providers";
import courses from "@/content/courses";
import Web3 from "web3";
import { useState, useEffect } from "react";
import Course from "@/utils/types"; // Ensure Course type is defined
import Card from "../order/Card";

function OwnedCourses() {
  const { account, contract } = useWeb3();
  const [ownedCourses, setOwnedCourses] = useState<
    Array<
      Course & {
        proof: string;
        price: string;
        owner: string;
        state: number;
      }
    >
  >([]);

  const getCourses = async () => {
    try {
      const coursePromises = courses.map(async (course) => {
        const hexCourseId = Web3.utils.utf8ToHex(course.id).padEnd(34, "0");
        const courseHash = Web3.utils.soliditySha3(
          { type: "bytes16", value: hexCourseId },
          { type: "address", value: account }
        );

        // Fetch the course ownership details from the contract
        const ownedCourseDetails = await contract.methods
          .getCourseByHash(courseHash)
          .call();

        // Combine owned course details with course data if the course exists
        if (ownedCourseDetails && ownedCourseDetails.price) {
          return {
            ...course,
            proof: ownedCourseDetails.proof, // Assuming 'proof' field exists
            price: Web3.utils.fromWei(ownedCourseDetails.price, "ether"), // Convert price to ETH
            owner: ownedCourseDetails.owner,
            state: ownedCourseDetails.state,
          };
        }
        return null;
      });

      const ownedCoursesList = (await Promise.all(coursePromises)).filter(
        (course) => course !== null
      ) as Array<
        Course & {
          proof: string;
          price: string;
          state: number;
          owner: string;
        }
      >;

      setOwnedCourses(ownedCoursesList);
    } catch (error) {
      console.error("Error fetching owned courses:", error);
    }
  };

  useEffect(() => {
    if (account && contract) {
      getCourses();
    }
  }, [account, contract]);
  console.log(ownedCourses);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Owned Courses</h1>
      <div className="flex flex-wrap gap-4 justify-around">
        {ownedCourses.length > 0 ? (
          ownedCourses.map((course, index) => (
            <Card
              key={course.id}
              title={course.title}
              price={course.price}
              orderId={Number(index)}
              proof={course.proof}
              image={course.coverImage}
              owner={course.owner}
              courseid={Number(course.id)}
            />
          ))
        ) : (
          <p>No owned courses found.</p>
        )}
      </div>
    </div>
  );
}

export default OwnedCourses;
