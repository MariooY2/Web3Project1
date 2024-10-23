"use client";
import { useWeb3 } from "@/Providers";
import LoadingSkeleton from "../common/LoadingSkeleton";
export default function WalletBar() {
  const { web3, provider, contract, account, balance, Network } = useWeb3();
  return (
    <section className="text-white bg-indigo-600">
      <div className="p-8">
        {account ? (
          <>
            <h1 className="text-2xl">Hello, {account}</h1>
            <h2 className="subtitle mb-5 text-xl">
              I hope you are having a great day!
            </h2>
          </>
        ) : (
          <>
            <LoadingSkeleton classname="w-2/3 h-16 mb-5" />
          </>
        )}

        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
              >
                Learn how to purchase
              </a>
            </div>
          </div>
          <div>
            {account ? (
              <div>
                <span>
                  Currently on
                  <strong className="text-2xl"> {Network}</strong>
                </span>
              </div>
            ) : (
              <>
                <LoadingSkeleton classname="w-44 h-14 mb-5" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
