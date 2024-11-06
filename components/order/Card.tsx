"use client";
import Image from "next/image";
import Link from "next/link";
import Web3 from "web3";
import { useRouter } from "next/navigation";
interface CardProps {
  title: string;
  price: string;
  orderId: number;
  owner: string;
  image: string;
  courseid: number;
  contract: any | null;
  account: any | null;
  web3: any | null;
}

export default function Card({
  title,
  price,
  orderId,
  owner,
  image,
  courseid,
  contract,
  account,
  web3,
}: CardProps) {
  const router = useRouter();

  const handesell = async () => {
    try {
      const hexCourseId = Web3.utils
        .utf8ToHex(String(courseid))
        .padEnd(34, "0");
      const courseHash = Web3.utils.soliditySha3(
        { type: "bytes16", value: hexCourseId },
        { type: "address", value: account }
      );
      const gasEstimate = await web3?.eth.estimateGas({ from: account });
      const result = await contract.methods
        .sellCourse(courseHash)
        .send({ from: account, gas: gasEstimate });
      router.push("/marketplace");
    } catch (error) {
      console.error("Error Selling Course", error);
    }
  };

  return (
    <div className="lg:w-1/4 sm:w-full bg-white shadow-md rounded-lg overflow-hidden mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Image Section */}

      <div className="flex items-center justify-center ">
        <div className=" relative w-full h-56">
          <Image
            src={image}
            alt={title}
            layout="fill"
            className="object-fill  rounded-t-lg"
          />
        </div>
      </div>
      {/* Title and Price */}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{price} ETH</p>
      </div>

      {/* Details Section */}
      <div className="px-6 py-4">
        <dl className="space-y-4">
          {/* Order ID */}
          <div className="flex items-center">
            <dt className="text-sm font-medium text-gray-500 w-1/3">
              Order ID
            </dt>
            <dd className="text-sm text-gray-900 w-2/3 break-words">
              {orderId}
            </dd>
          </div>

          {/* Owner Address */}
          <div className="flex items-center">
            <dt className="text-sm font-medium text-gray-500 w-1/3">Owner</dt>
            <dd className="text-sm text-gray-900 w-2/3 break-words">{owner}</dd>
          </div>
        </dl>
      </div>

      {/* Footer Button */}
      <div className="flex justify-around">
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <Link href={`course/${courseid}`}>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none">
              View Course
            </button>
          </Link>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
            onClick={handesell}
          >
            Sell Course
          </button>
        </div>
      </div>
    </div>
  );
}
