"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Course from "@/utils/types";
import Web3 from "web3";
import { useRouter } from "next/navigation";

interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  course: Course;
  address: string | null;
  EthPrice: number | null;
  contract: any | null;
}

export default function CourseModal({
  showModal,
  setShowModal,
  course,
  address,
  EthPrice,
  contract,
}: ModalProps) {
  
  const courseETH = 0.1;
  const coursePriceETH = Web3.utils.toWei(String(0.1), "ether");
  const router = useRouter();

  // State for accepting terms and error message
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setShowModal(false);
  };

  const purchaseCourse = async () => {
    const hexCourseId = Web3.utils.utf8ToHex(course.id).padEnd(34, "0"); // Add padding

    try {
      const value = coursePriceETH;
      const result = await contract.methods
        .purchaseCourse(hexCourseId)
        .send({ from: address, value: value });
      console.log(result);
    } catch (error) {
      console.error("Error purchasing course:", error);
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setErrorMessage("You must accept the terms of service to proceed.");
      return;
    }

    setErrorMessage(""); // Clear any previous error
    await purchaseCourse();
    router.push("/owned");
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-600 opacity-50 z-40"></div>
          <div className="bg-white w-full max-w-lg p-8 rounded-md shadow-lg relative z-50">
            <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Price (ETH)
              </label>
              <input
                type="number"
                disabled={true}
                value={courseETH!}
                className="w-full border rounded-md p-2 "
              />
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 h-4 w-4"
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the terms of service and understand my order may be
                rejected if the data provided above is incorrect.
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}

            {/* Button Section */}
            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
