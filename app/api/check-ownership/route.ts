// app/api/check-ownership/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Web3 from "web3";
import LoadContract from "@/utils/LoadContract";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");
  const courseId = searchParams.get("courseId");

  if (!account || !courseId) {
    return NextResponse.json(
      { error: "Account and courseId are required" },
      { status: 400 }
    );
  }

  try {
    const web3 = new Web3("HTTP://127.0.0.1:7545");
    const contract = await LoadContract("CourseMarketplace", web3);
    const hexCourseId = Web3.utils.utf8ToHex(courseId).padEnd(34, "0");
    // Generate course hash or fetch details based on your contract logic
    const courseHash = Web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account }
    );

    const ownedCourseDetails = await contract.methods
      .getCourseByHash(courseHash)
      .call();

    // Check if course ownership is valid
    const isOwner = ownedCourseDetails && ownedCourseDetails.owner === account;

    return NextResponse.json({ isOwner });
  } catch (error) {
    console.error("Error verifying course ownership:", error);
    return NextResponse.json(
      { error: "Failed to verify course ownership" },
      { status: 500 }
    );
  }
}
