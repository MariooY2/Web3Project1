import contract from "../public/contracts/CourseMarketplace";
const LoadContract = async (name: string, web3: any) => {
  //const res = await fetch(`../contracts/${name}.json`);
  //console.log(res)
  //const Artifact = await res.json();
  const Artifact: any = contract;
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Artifact.networks[Number(networkId)];

  if (!deployedNetwork) {
    console.error(`Contract not found on network with ID ${networkId}`);
    return;
  }

  const contractInstance = new web3.eth.Contract(
    Artifact.abi,
    deployedNetwork.address
  );
  return contractInstance;
};
export default LoadContract;
