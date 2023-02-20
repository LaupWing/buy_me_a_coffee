import { Dispatch, FC, SetStateAction } from "react"
import { Control, Controller } from "react-hook-form"
import { ItemsType } from "types"
import { EditFormValues } from "~/pages/campaign/[address]/edit"
import { IconTrashcan, Items } from "~/components/elements"

interface CurrentListOfItemsProps {
   control: Control<EditFormValues>
   addedItems: ItemsType[]
   setAddedItems: Dispatch<SetStateAction<ItemsType[]>>
   setDeletedItems: Dispatch<SetStateAction<ItemsType[]>>
}

export const CurrentListOfItems:FC<CurrentListOfItemsProps> = ({
   control,
   addedItems,
   setAddedItems,
   setDeletedItems
}) => {
   return (
      <Controller
         control={control}
         name="listOfItems"
         rules={{
            required: "You need at least one list of items!"
         }}
         render={({field}) => (
            <ul className="flex flex-col space-y-2">
               {field.value
                  .map((listOfItems, i) => (
                     <div className="border-2 bg-gray overflow-hidden rounded divide-x-2 items-stretch flex">
                        <Items 
                           {...listOfItems}
                        />
                        <div 
                           className="flex text-red-400 items-center px-4 cursor-pointer hover:bg-red-400 duration-200 hover:text-white"
                           onClick={() => {
                              field.onChange(field.value.filter((_, i2) => i !== i2))
                              const check = (x: ItemsType) => JSON.stringify(x) !== JSON.stringify(listOfItems)

                              if(addedItems.find(check)){
                                 setAddedItems(prev => prev.filter(check))
                              }else{
                                 setDeletedItems(prev => [...prev, listOfItems])
                              }
                           }}
                        >
                           <IconTrashcan size={20}/>
                        </div>
                     </div>
                  ))}
            </ul>
         )}
      />
   )
}