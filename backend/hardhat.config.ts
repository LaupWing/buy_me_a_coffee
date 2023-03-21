import { HardhatUserConfig } from "hardhat/config"
import "dotenv/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
   solidity: {
      version: "0.8.17",
      settings: {
         optimizer: {
            enabled: true,
            runs: 200
          }
      }
   },
   defaultNetwork: "hardhat",
   networks: {
      hardhat:{
         chainId: 31337
      },
      goerli: {
         url: GOERLI_RPC_URL,
         accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
         chainId: 5
      }
   },
   etherscan:{
      apiKey:{
         goerli: ETHERSCAN_API_KEY  
      } 
   },
   gasReporter:{
      enabled: true,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      coinmarketcap: process.env.COINMARKETCAP_API_KEY
   },
   namedAccounts:{
      deployer:{
         default: 0,
         1: 0,
         5: 0
      },
      user1:{
         default: 1
      },
      user2:{
         default: 2
      },
   }
}

export default config