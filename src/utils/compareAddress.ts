import { ethers } from "ethers"
import { useAppSelector } from "~/store/hooks"

export default (address: string, address2: string) => {
   return ethers.utils.getAddress(address) === ethers.utils.getAddress(address2)
}