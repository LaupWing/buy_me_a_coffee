import { ethers } from "ethers"
import { useAppSelector } from "~/store/hooks"

export default (address: string) => {
   const { account } = useAppSelector(state => state.web3)
   const owned = ethers.utils.getAddress(account) === ethers.utils.getAddress(address)
   return owned
}