import { GetServerSideProps } from "next"
import { ethers, ContractInterface} from "ethers"
import contractAddresses from "../../../constants/networks.json"
import BuyMeACoffeeFactoryAbi from "../../../constants/contracts/BuyMeACoffeeFactory.json"

const Campaign = () => {
   return (
      <div className="container mt-6">Campaign</div>
   )
}
export default Campaign


export const getServerSideProps:GetServerSideProps = async () => {
   console.log("from the server")
   const provider = new ethers.providers.JsonRpcProvider("HTTP://172.27.224.1:8545")
   const signer = new ethers.Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider)

   const contract = new ethers.Contract(
      contractAddresses[31337].BuyMeACoffeeFactory[contractAddresses[31337].BuyMeACoffeeFactory.length -1],
      BuyMeACoffeeFactoryAbi as ContractInterface,
      signer
   )
   
   console.log(await contract.getDeployedBuyMeACoffee())
   return {
      props: {

      }
   }
}