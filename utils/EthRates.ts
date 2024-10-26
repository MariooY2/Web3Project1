async function EthRates() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await res.json();
    const price:number|null=data.ethereum.usd;
    return price; // Returns the ETH price in USD
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return null; // Return null if there's an error
  }
}
export default EthRates;
