"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Course from "@/utils/types";
import Web3 from "web3";

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
  const [email, setEmail] = useState("");
  const [repeatEmail, setRepeatEmail] = useState("");
  const [error, setError] = useState("");
  const coursePriceUSD = 5;
  const courseETH = EthPrice ? (coursePriceUSD / EthPrice).toFixed(6) : null;
  const coursePriceETH = courseETH;

  const handleClose = () => {
    setShowModal(false);
    setEmail("");
    setRepeatEmail("");
    setError("");
  };

  const purchaseCourse = async () => {
    const hexCourseId = Web3.utils.utf8ToHex(course.id).padEnd(34, "0"); // Add padding
    //ID ---> ASCI
    //id: "1410474" ----> 0x31343130343734
    //console.log(hexCourseId);

    const orderHash = Web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: address }
    );
    //hex Course ID 16 bytes = 0x31343130343734000000000000000000
    //address = 93Bd787F60A9433f9f37B4a4CD6BD5f06A63eA60
    //orderhash = keccak256(0x3134313034373400000000000000000093Bd787F60A9433f9f37B4a4CD6BD5f06A63eA60)
    //0x2b2d88d403522217e04d6211fc2795511df01ce357dc49b3fe121d30d1936399

    //console.log(orderHash);

    const emailHash = Web3.utils.sha3(email);
    //test@gmail.com
    //0xaf257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902

    //console.log(emailHash);
    const proof = Web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: orderHash }
    );

    //proof=keccak256(af257bcc3cf653863a77012256c927f26d8ab55c5bea37510
    //63d049d0538b9020x2b2d88d403522217e04d6211fc2795511df01ce357dc49b3fe121d30d1936399)

    //console.log(proof);

    try {
      const value = Web3.utils.toWei(String(coursePriceETH), "ether");
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: address, value: value });
      console.log(result);
    } catch (error) {
      console.error("Error purchasing course:", error);
    }
  };

  const handleSubmit = async () => {
    if (email !== repeatEmail) {
      setError("Emails do not match. Please check your entries.");
    } else {
      setError("");
      await purchaseCourse();
      setShowModal(false);
    }
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
                value={coursePriceETH!}
                className="w-full border rounded-md p-2 "
              />
            </div>

            {/* Email Section */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="x@y.com"
                className="w-full border rounded-md p-2"
              />
            </div>

            {/* Repeat Email */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Repeat Email
              </label>
              <input
                type="email"
                value={repeatEmail}
                onChange={(e) => setRepeatEmail(e.target.value)}
                placeholder="x@y.com"
                className="w-full border rounded-md p-2"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <input type="checkbox" id="terms" className="mr-2 h-4 w-4" />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept terms of service and understand my order may be
                rejected if the data provided above is incorrect.
              </label>
            </div>

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
