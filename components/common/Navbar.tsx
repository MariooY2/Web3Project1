"use client";
import Link from "next/link";
import { useWeb3 } from "@/Providers";
export default function Navbar() {
  const { provider, account, contract } = useWeb3();
  //console.log(contract);
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
                Home
              </Link>
              <Link
                href="/marketplace"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Marketplace
              </Link>
              <Link
                href="/owned"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                My Courses
              </Link>
            </div>
            <div>
              {account ? (
                <div className="w-full flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 md:py-3 md:px-6">
                  {`Connected`}
                </div>
              ) : provider ? (
                <>
                  <button
                    className="w-full flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:px-6"
                    onClick={() => {
                      provider.request({ method: "eth_requestAccounts" });
                    }}
                  >
                    Connect Metamask
                  </button>
                </>
              ) : (
                <Link href="https://metamask.io/download/">
                  <button className="w-full flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:px-6">
                    Install Metamask
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
