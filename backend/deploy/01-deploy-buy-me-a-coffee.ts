import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";


const deployBuyMeACoffee: DeployFunction = async ({
   getNamedAccounts,
   deployments
}: HardhatRuntimeEnvironment) =>{
   const { deploy, log} = deployments
   const { deployer } = await getNamedAccounts()
   
   if (developmentChains.includes(network.name)){
      const mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
      console.log(mockV3Aggregator.address)
   }
}

export default deployBuyMeACoffee
deployBuyMeACoffee.tags = ["all", "buyMeACoffee"]