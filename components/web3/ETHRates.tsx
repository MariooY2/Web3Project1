"use client";
import { useWeb3 } from "@/Providers";
export default function EthRates() {

  const coursePriceUSD = 5; // Fixed price in USD for the course
  
  const { EthPrice } = useWeb3();
  const courseETH = EthPrice
  ? (coursePriceUSD / EthPrice).toFixed(6)
  : null;
  const coursePriceETH = courseETH;
 
  return (
    <div className="grid grid-cols-4 mb-5">
      {/* ETH price card */}
      <div className="flex flex-1 items-stretch text-center">
        <div className="p-10 border drop-shadow rounded-md">
          <div>
            <span className="text-2xl font-bold">
              {EthPrice ? `ETH = $${EthPrice.toFixed(2)}` : "Loading..."}
            </span>
          </div>
          <p className="text-xl text-gray-500">Current ETH Price</p>
        </div>
      </div>

      {/* Course price in ETH */}
      <div className="flex flex-1 items-stretch text-center">
        <div className="p-10 border drop-shadow rounded-md">
          <div>
            <span className="text-2xl font-bold">
              {EthPrice && coursePriceETH
                ? `${coursePriceETH} ETH = $${coursePriceUSD}`
                : "Loading..."}
            </span>
          </div>
          <p className="text-xl text-gray-500">Price per course</p>
        </div>
      </div>
    </div>
  );
}
