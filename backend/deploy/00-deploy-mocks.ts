import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

const deployMocks: DeployFunction = async ({
   getNamedAccounts,
   deployments
}:HardhatRuntimeEnvironment) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   if(developmentChains.includes(network.name)){
      await deploy("VRFCoordinatorV2Mock", {
         from: deployer,
         log: true,
         args: [BASE_FEE, GAS_PRICE_LINK]
      })
      
      log("Mocks deployed!")
      log("################################")
      log("You are deploying to local network, you'll need a local network running to interact")
      log("Please run `npx hardhat console --network localhost` to interact with the deployed contracts!!")
      log("################################################################")
      console.log("Local network detected! Deploying mocks...")
   }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]