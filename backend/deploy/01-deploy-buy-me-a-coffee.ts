import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";


const deployBuyMeACoffee: DeployFunction = async ({
   getNamedAccounts,
   deployments
}: HardhatRuntimeEnvironment) =>{
   const { deploy, log} = deployments
   const { deployer } = await getNamedAccounts()
   
}