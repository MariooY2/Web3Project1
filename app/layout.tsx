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
            <div className="relative max-w-7xl mx-auto px-4">
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
