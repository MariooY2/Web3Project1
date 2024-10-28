import Image from "next/image";
import Link from "next/link";
interface CardProps {
  title: string;
  price: string;
  orderId: number;
  proof: string;
  owner: string;
  image: string;
  courseid: number;
}

export default function Card({
  title,
  price,
  orderId,
  proof,
  owner,
  image,
  courseid,
}: CardProps) {
  // Copy to clipboard function for proof
  const handleCopyProof = () => {
    navigator.clipboard.writeText(proof);
    alert("Proof copied to clipboard!");
  };

  return (
    <div className="lg:w-1/3 sm:w-full bg-white shadow-md rounded-lg overflow-hidden mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
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

          {/* Proof with Copy-to-Clipboard */}
          <div className="flex items-center">
            <dt className="text-sm font-medium text-gray-500 w-1/3">Proof</dt>
            <dd className="text-sm text-gray-900 w-2/3 flex items-center ">
              <span className="break-words">{proof}</span>
              <button
                onClick={handleCopyProof}
                className="text-white p-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Copy
              </button>
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
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <Link href={`course/${courseid}`}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none">
            View Course
          </button>
        </Link>
      </div>
    </div>
  );
}
