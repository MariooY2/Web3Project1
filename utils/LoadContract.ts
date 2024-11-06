
// Import contract ABI from your compiled artifacts
import contractABI from "../public/contracts/CourseMarketplace.json";  // Make sure this path is correct

const LoadContract = async (name: string, web3: any) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("Contract address is not defined in .env");
    return;
  }

  const contractInstance = new web3.eth.Contract(contractABI.abi, contractAddress);
  return contractInstance;
};

export default LoadContract;
