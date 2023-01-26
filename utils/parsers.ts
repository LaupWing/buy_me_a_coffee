import { ItemsType } from "../typings";

export const parseListOfItems = (listOfItems: ItemsType[]) : {
   all_items: string[][],
   all_values: string[]
} => {
   const converted = listOfItems.map((items, index)=>{
      return {
         index,
         items: items.items
      }
   })
   const all_items = converted.map(x => x.items)
   const all_values = converted.map(({index}) => (
      listOfItems[index].value.toString()
   ))

   return {
      all_items,
      all_values
   }
}