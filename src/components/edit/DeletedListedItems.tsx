import { Dispatch, FC, SetStateAction } from "react"
import { ItemsType } from "types"
import { IconUndo, Items } from "../elements"

interface DeletedListedItemsProps {
   deletedItems: ItemsType[]
   undo: (item: ItemsType) => void
}

export const DeletedListedItems:FC<DeletedListedItemsProps> = ({
   deletedItems,
   undo
}) => {
   return (
      <div className="my-4 space-y-1">
         <div className="flex flex-col space-y-0.5">
            <h2 className="uppercase font-bold text-sm text-red-400">Deleted items</h2>
            <p className="text-sm text-red-300">This is an list of items that are currently listed in the contract. All of the items below will be removed, therfore the connection between the supporters and the items they bougth will be lost. You can undo this by pressing the undo button.</p>
         </div>
         {deletedItems
            .map((listOfItems, i) => (
               <div 
                  className="border-2 overflow-hidden bg-gray-100 rounded divide-x-2 items-stretch flex"
                  key={i}
               >
                  <Items
                     {...listOfItems}
                  />
                  <div 
                     className="flex text-blue-400 items-center px-4 cursor-pointer hover:bg-blue-400 duration-200 hover:text-white"
                     onClick={() => undo(listOfItems)}
                  >
                     <IconUndo size={20}/>
                  </div>
               </div>
            ))}
      </div>
   )
}