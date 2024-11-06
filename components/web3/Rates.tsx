"use client";

import { useWeb3 } from "@/Providers";
import { useState, useEffect } from "react";

export default function Rates() {
  const { EthPrice } = useWeb3();
  const courseETH = 0.1;
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Update lastUpdate time on the client after component mounts
  useEffect(() => {
    const date = new Date();
    setLastUpdate(date.toLocaleTimeString());
  }, []);

  return (
    <div className="flex justify-between mb-5 items-center">
      {/* ETH price card */}
      <div className="text-center">
        <div className="p-10 border drop-shadow rounded-md">
          <div>
            <span className="text-2xl font-bold">
              {EthPrice ? `ETH = $${EthPrice.toFixed(2)}` : "Loading..."}
            </span>
          </div>
          <p className="text-xl text-gray-500">Current ETH Price</p>
          <p className="text-sm text-gray-400">
            Last updated: {lastUpdate || "Loading..."}
          </p>
        </div>
      </div>

      {/* Course price in ETH */}
      <div className="text-center">
        <div className="p-10 border drop-shadow rounded-md">
          <div>
            <span className="text-2xl font-bold">
              {EthPrice && courseETH
                ? `${courseETH} ETH = $${(courseETH * EthPrice).toFixed(2)}`
                : "Loading..."}
            </span>
          </div>
          <p className="text-xl text-gray-500">Price per course</p>
          <p className="text-sm text-gray-400">
            Last updated: {lastUpdate || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}
