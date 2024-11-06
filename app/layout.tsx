import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Web3Provider from "@/Providers";

export const metadata: Metadata = {
  title: "DApp",
  description: "Decentralized Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative bg-white overflow-hidden">
          <Web3Provider>
            <div className="relative mx-auto max-w-[1800px] xl:px-24 px-10">
              <Navbar />
              {children}
            </div>
            <Footer />
          </Web3Provider>
        </div>
      </body>
    </html>
  );
}
