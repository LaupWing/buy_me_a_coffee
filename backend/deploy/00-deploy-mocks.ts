import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"

const deployMocks: DeployFunction = async ({
   getNamedAccounts,
   deployments
}:HardhatRuntimeEnvironment) => {
   const { deploy, log } = deployments
   const { deployer } = await getNamedAccounts()

   if(developmentChains.includes(network.name)){
      await deploy("MockV3Aggregator", {
         from: deployer,
         log: true,
         args: [DECIMALS, INITIAL_PRICE]
      })
      
      log("Mocks deployed!")
      log("################################################################")
      log("You are deploying to local network, you'll need a local network running to interact")
      log("Please run `npx hardhat console --network localhost` to interact with the deployed contracts!!")
      log("################################################################")
      console.log("Local network detected! Deploying mocks...")
   }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]