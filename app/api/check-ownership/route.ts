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
    // Use Alchemy or Sepolia RPC URL in production (as Web3.givenProvider is not available server-side)
    const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY}`;
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

    // Load the contract instance using the contract ABI and address from environment variables
    const contract = await LoadContract("CourseMarketplace", web3);

    // Convert courseId into the format expected by the contract (e.g., hex)
    const hexCourseId = Web3.utils.utf8ToHex(courseId).padEnd(34, "0");

    // Generate the course hash based on courseId and account
    const courseHash = Web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account }
    );

    // Interact with the contract to get course details by hash
    const ownedCourseDetails = await contract.methods
      .getCourseByHash(courseHash)
      .call();

    // Check if the course owner matches the account
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
