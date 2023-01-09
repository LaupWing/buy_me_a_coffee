import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";


const deployBuyMeACoffee: DeployFunction = async ({
   getNamedAccounts,
   deployments
}: HardhatRuntimeEnvironment) =>{
   const { deploy, log} = deployments
   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId as keyof typeof networkConfig
   let ethUsdPriceFeedAddress
   
   if (developmentChains.includes(network.name)){
      const mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
      ethUsdPriceFeedAddress = mockV3Aggregator.address
   } else {
      ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
   }

   const buyMeACoffee = await deploy("BuyMeACoffee", {
      from: deployer,
      args: [ethUsdPriceFeedAddress],
      log: true,
      waitConfirmations: 1
   })

   console.log(buyMeACoffee.address)
}

export default deployBuyMeACoffee
deployBuyMeACoffee.tags = ["all", "buyMeACoffee"]