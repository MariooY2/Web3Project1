"use client";
import Link from "next/link";
import { useWeb3 } from "@/Providers";
import { useEffect, useState } from "react";
export default function Hero() {
  const [balance, setbalance] = useState<string>();

  const {  account, web3, contract } = useWeb3();

  const contractAddress = contract?.options.address;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceWei = await web3?.eth.getBalance(contractAddress);
        const balanceInEth = web3?.utils.fromWei(Number(balanceWei), "ether");
        setbalance(balanceInEth);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [web3, contractAddress]);
  console.log(balance)

  async function withdrawfunds() {
    try {
      const amount = 0.1;
      const weiamount = web3?.utils.toWei(String(amount), "ether");
      if (!contract || !account) {
        console.error("Contract or account is not available.");
        return;
      }
      const gasEstimate=await web3?.eth.estimateGas({from:account});

      const result = await contract.methods.withdraw(weiamount).send({from:account,gas:gasEstimate});
      console.log(result);

    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  }
  return (
    <div className="min-h-[95vh] ">
      <div className="justify-between flex items-center flex-col">
        <section className="lg:2/6 my-28 max-w-3xl mx-auto text-center ">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl leading-tight">
            Grow your career as a developer
          </h1>
          <p className="mt-6 text-xl font-light ">
            Learn programming and web development the easy way! Get unlimited
            access to all of our courses.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/marketplace"
              className="px-8 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-lg font-semibold"
            >
              Get started
            </Link>
          </div>
        </section>
      </div>
      <div className="flex justify-center items-center text-white">
        <div className="w-full max-w-md bg-indigo-600 shadow-lg rounded-lg p-6 backdrop-blur-lg">
          <h2 className="text-2xl font-bold  text-center mb-4">
            Contract Information
          </h2>
          <div className="border-b border-gray-300 mb-4"></div>

          {/* Contract Address Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Contract Address:</h3>
            <p className="text-gray-600 break-all bg-gray-100 p-2 rounded-md text-center">
              {contractAddress}
            </p>
          </div>

          {/* Contract Balance Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold ">Contract Balance:</h3>
            {balance !== null ? (
              <p className="text-gray-600 bg-gray-100 p-2 rounded-md text-center">
                {balance} ETH
              </p>
            ) : (
              <p className="text-gray-600 bg-gray-100 p-2 rounded-md text-center">
                Loading balance...
              </p>
            )}
          </div>
          <div className="flex justify-center items-center mt-5">
            <button
              onClick={withdrawfunds}
              className="bg-white text-indigo-600 p-2 rounded-2xl hover:bg-slate-200"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
