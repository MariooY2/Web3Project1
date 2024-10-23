import Hero from "@/components/common/Hero";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import EthRates from "@/components/web3/ETHRates";
import WalletBar from "@/components/web3/WalletBar";
import Card from "@/components/order/Card";
import List from "@/components/course/list";

function page() {
  
  return (
    <div>
      <div className="fit">
        <Hero />
        <Breadcrumbs />
        <WalletBar />
        <EthRates />
        <Card />
        <List />
      </div>
    </div>
  );
}

export default page;

