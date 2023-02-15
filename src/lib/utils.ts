import { ListOfItems } from "types"
import { ITEMS } from "../../constants"

export const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0

export const parseItems = ( item : ListOfItems) => ({
   ...item,
   id: item.id.toString(),
   cost: item.cost.toString(),
})