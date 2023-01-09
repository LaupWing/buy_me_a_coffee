import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"

const deployMocks: DeployFunction = async ({
   getNamedAccounts,
   deployments
}:HardhatRuntimeEnvironment) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   console.log(deployer)

   if(developmentChains.includes(network.name)){
      // await deploy()
   }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]