import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"

const config: HardhatUserConfig = {
   solidity: "0.8.17",
   defaultNetwork: "hardhat",
   networks: {
      hardhat:{
         chainId: 31337
      }
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