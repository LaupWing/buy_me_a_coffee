export const networkConfig = {
   31337: {
      name: "localhost",
      ethUsdPriceFeed: "",
      callbackGasLimit: ""
   },
   5: {
      name: "goerli",
      ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
      callbackGasLimit: "500000"
   }
}

export const frontendContractAddresses = "../constants/networks.json"
export const frontendContractAbi = "../constants/contracts"

export const developmentChains = ["hardhat", "localhost"]