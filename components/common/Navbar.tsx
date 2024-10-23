"use client"
import Link from "next/link";
import { useWeb3 } from "@/Providers";
export default function Navbar() {



  const { web3, provider, contract, account, balance, Network } = useWeb3();
  console.log(web3); //null

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Product
              </Link>
              <Link
                href="/"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Marketplace
              </Link>
              <Link
                href="/"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Blogs
              </Link>
            </div>
            <div>
              {account ? (
                <div className="w-full flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 md:py-3 md:px-6">
                  {`Connected`}
                </div>
              ) : (
                <button
                  className="w-full flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:px-6"
                  onClick={() => {
                    if (provider) {
                      provider.request({ method: "eth_requestAccounts" });
                    } else {
                      console.error("MetaMask provider not available");
                    }
                  }}
                >
                  Connect Metamask
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
