import { ethers } from "ethers"

export default (address: string, address2: string) => {
   return ethers.utils.getAddress(address) === ethers.utils.getAddress(address2)
}