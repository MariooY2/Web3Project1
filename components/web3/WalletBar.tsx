"use client";
import { useWeb3 } from "@/Providers";
import LoadingSkeleton from "../common/LoadingSkeleton";
export default function WalletBar() {
  const { account, balance, Network, isSupported } = useWeb3();
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
            {account ? (
              <div className="rounded-md shadow">
                <h1 className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 hover:cursor-pointer">
                  {balance?.toFixed(4)} ETH
                </h1>
              </div>
            ) : (
              <>
                <LoadingSkeleton classname="w-20 h-16 mb-5" />
              </>
            )}
          </div>
          <div>
            {account ? (
              isSupported ? (
                <>Supported Network</>
              ) : (
                <>
                  <>
                    Not Supported Please Connect to{" "}
                    <strong className="text-xl">Ganache (5777)</strong>
                  </>
                </>
              )
            ) : (
              <LoadingSkeleton classname="w-60 h-14 mb-5" />
            )}
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
