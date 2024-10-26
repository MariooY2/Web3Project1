import List from "@/components/course/list";
import EthRates from "@/components/web3/ETHRates";
import WalletBar from "@/components/web3/WalletBar";
import Card from "@/components/order/Card";
import Breadcrumbs from "@/components/common/Breadcrumbs";

function page() {
  return (
    <div className="mt-5">
      <WalletBar />
      <EthRates />
      <Breadcrumbs/>
      <List button={true} />
    </div>
  );
}

export default page;
