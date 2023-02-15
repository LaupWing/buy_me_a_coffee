import { ethers } from "ethers"
import { ListOfItems } from "types"
import { ITEMS } from "../../constants"

export const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0

export const parseItems = ( item : ListOfItems) => ({
   ...item,
   id: item.id.toString(),
   cost: Number(ethers.utils.formatEther(item.cost.toString())),
})