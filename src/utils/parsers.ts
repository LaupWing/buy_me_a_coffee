import { BigNumber, ethers } from "ethers"
import { ItemsType } from "types"

export const parseListOfItems = (
   listOfItems: ItemsType[]
): {
   all_items: string[][]
   all_values: BigNumber[]
} => {
   const converted = listOfItems.map((items, index) => {
      return {
         index,
         items: items.names,
      }
   })
   const all_items = converted.map((x) => x.items)
   const all_values = converted.map(({ index }) =>
      listOfItems[index].cost.toString()
   )

   return {
      all_items,
      all_values: all_values.map(x=>ethers.utils.parseEther(x)),
   }
}
