"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import LoadContract from "@/utils/LoadContract";
import EthRates from "@/utils/EthRates";
import Cookies from "js-cookie";
// Type definitions
interface Web3Api {
  provider: any | null; // MetaMask provider type can be more specific
  web3: Web3 | null;
  contract: any | null; // Replace 'any' with the actual contract type if available
  account: string | null; // Changed to string for clarity
  balance: number | null; // Use number for balance
  Network: string | null; // Changed to 'network' for clarity
  isAdmin: boolean | null;
  isSupported: boolean | null;
  EthPrice: number | null;
}

// Create Web3 context with appropriate types
const Web3Context = createContext<Web3Api | null>(null);

// Web3Provider Component
export default function Web3Provider({ children }: { children: ReactNode }) {
  const [web3Api, setWeb3Api] = useState<Web3Api>({
    provider: null,
    web3: null,
    contract: null,
    account: null,
    balance: null,
    Network: null,
    isAdmin: null,
    isSupported: false,
    EthPrice: null,
  });

  // Function to fetch and set account, balance, and network
  const updateWeb3Data = async (web3: Web3) => {
    const accounts = await web3.eth.getAccounts();
    let balance = null;
    let hashedaddress = null;
    let networkId = 0;
    if (accounts.length > 0) {
      balance = Number(await web3.eth.getBalance(accounts[0]));
      hashedaddress = Web3.utils.keccak256(accounts[0]);
      networkId = Number(await web3.eth.net.getId());
      Cookies.set("userAccount", accounts[0], { expires: 1 });
    } else {
      Cookies.remove("userAccount");
    }

    const contract = await LoadContract("CourseMarketplace", web3);
    const Price = await EthRates();

    let network = "";
    switch (networkId) {
      case 1:
        network = "Mainnet";
        break;
      case 3:
        network = "Ropsten";
        break;
      case 4:
        network = "Rinkeby";
        break;
      case 5:
        network = "Goerli";
        break;
      case 42:
        network = "Kovan";
        break;
      case 5777:
        network = "Ganache";
        break;
      case 11155111:
        network = "Sepolia";
        break;
      default:
        network = "Unknown Network";
    }
    setWeb3Api({
      provider: web3.currentProvider,
      web3,
      contract: contract, // Initialize contract as needed later
      account: accounts[0] || null,
      balance:
        balance !== null
          ? Number(web3.utils.fromWei(balance.toString(), "ether"))
          : null,
      Network: network,
      isAdmin: hashedaddress == process.env.NEXT_PUBLIC_ADMIN ? true : false,
      isSupported: networkId === 5777,
      EthPrice: Price,
    });
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = (await detectEthereumProvider()) as any; // MetaMask provider detection
      if (provider) {
        const web3 = new Web3(provider);
        /* ||
            new Web3.providers.HttpProvider(
              `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY}`
            */
        // Update state on initial load
        await updateWeb3Data(web3);

        // Listen for account changes
        provider.on("accountsChanged", async () => {
          await updateWeb3Data(web3);
        });

        // Listen for network changes
        provider.on("chainChanged", async () => {
          await updateWeb3Data(web3);
        });
      } else {
        console.error("Please install MetaMask");
        setWeb3Api({
          provider: null,
          web3: null,
          contract: null,
          account: null,
          balance: null,
          Network: null,
          isAdmin: null,
          isSupported: false,
          EthPrice: null,
        });
      }
    };

    loadProvider();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
}

// Custom hook to use Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
