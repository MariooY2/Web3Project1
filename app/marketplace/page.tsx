import List from "@/components/course/list";
import EthRates from "@/components/web3/Rates";
import WalletBar from "@/components/web3/WalletBar";


function page() {
  return (
    <div className="mt-5">
      <WalletBar />
      <EthRates />
      <List button={true} />
    </div>
  );
}

export default page;
