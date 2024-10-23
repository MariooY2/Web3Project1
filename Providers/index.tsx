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

// Type definitions
interface Web3Api {
  provider: any | null; // MetaMask provider type can be more specific
  web3: Web3 | null;
  contract: any | null; // Replace 'any' with the actual contract type if available
  account: string | null; // Changed to string for clarity
  balance: number | null; // Use number for balance
  Network: string | null; // Changed to 'network' for clarity
  
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
  });

  // Function to fetch and set account, balance, and network
  const updateWeb3Data = async (web3: Web3) => {
    const accounts = await web3.eth.getAccounts();
    let balance = null;
    if (accounts.length > 0) {
      balance = Number(await web3.eth.getBalance(accounts[0]));
    }
    const networkId = Number(await web3.eth.net.getId());
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
      case 11155111:
        network = "Sepolia";
        break;
      default:
        network = "Unknown Network";
    }
    setWeb3Api({
      provider: web3.currentProvider,
      web3,
      contract: null, // Initialize contract as needed later
      account: accounts[0] || null,
      balance: balance !== null ? Number(web3.utils.fromWei(balance.toString(), "ether")) : null,
      Network:network,
    });
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = (await detectEthereumProvider()) as any; // MetaMask provider detection
      if (provider) {
        const web3 = new Web3(provider);
        
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
        });
      }
    };

    loadProvider();

    // Cleanup event listeners on component unmount
    return () => {
      const provider = web3Api.provider;
      if (provider) {
        provider.removeListener("accountsChanged", async () => {
          await updateWeb3Data(web3Api.web3);
        });
        provider.removeListener("chainChanged", async () => {
          await updateWeb3Data(web3Api.web3);
        });
      }
    };
  }, []);

  console.log(web3Api); // Debugging output

  return (
    <Web3Context.Provider value={web3Api}>
      {children}
    </Web3Context.Provider>
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
