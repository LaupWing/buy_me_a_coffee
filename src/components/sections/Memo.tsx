import {FC} from "react"
import { ethers } from "ethers"
import { FaEthereum } from "react-icons/fa"
import { ListOfItems } from "../../../typings"
import { useAppSelector } from "~/store/hooks"
import { findItem } from "~/lib/utils"
import { Controller, ControllerRenderProps, useForm, UseFormRegister } from "react-hook-form"

interface MemoFormValues {
   message: string
   name: string
   items: string | null
}

export const Memo = ({campaign}:any) => {
   const { 
      register,
      control
    } = useForm<MemoFormValues>({
      defaultValues: {
         name: "",
         message: "",
         items: null
      }
   })

   return (
      <form className="w-full mt-6 flex flex-col shadow max-w-lg p-4 border border-neutral-300 rounded mx-auto bg-white">
         <h3 className="text-3xl font-semibold mb-8 text-neutral-600 tracking-tight">Buy {campaign.name} a treat!</h3>
         {campaign && (
            <Controller
               control={control}
               name="items"
               render={({ field })=>(
                  <ul className="flex flex-col space-y-2">
                     {campaign.listOfItems.map((listOfItems:ListOfItems) => (
                        <ListOfItems 
                           listOfItems={listOfItems}
                           field={field}
                        />
                     ))}
                  </ul>
               )}
            />
         )}
         <div className="my-4 space-y-4">
            <input 
               type="text" 
               className="w-full bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded"
               {...register("name", {
                  required: "Please enter your name :)",
               })}
               placeholder="Name"
            />
            <textarea 
               className="w-full h-44 resize-none bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded"
               {...register("message")}
               placeholder="Message"
            >
            </textarea>
         </div>
         <button className="btn">
            Buy
         </button>
      </form>
   )
}
export default Memo

interface ListOfItemsProps {
   listOfItems: ListOfItems
   field: ControllerRenderProps<MemoFormValues, "items">
}

const ListOfItems:FC<ListOfItemsProps> = ({
   listOfItems,
   field
}) => {
   const { ethPrice } = useAppSelector(state => state.contracts)
   const checked = listOfItems.id.toString() === field.value
   return (
      <>
         <input 
            type="radio" 
            className="sr-only peer"
            id={`item${listOfItems.id.toString()}`}
            value={listOfItems.id.toString()}
            onChange={e => {
               if(e.target.checked){
                  field.onChange(listOfItems.id.toString())
               }
            }}
            checked={checked}
         />
         <label 
            className={"flex items-center cursor-pointer justify-between rounded p-3 border-2 " +  (checked 
                  ? "border-yellow-400 bg-yellow-400/20"
                  : "border-yellow-400/30 bg-yellow-400/5"
               )
            }
            key={listOfItems.id.toString()}
            htmlFor={`item${listOfItems.id.toString()}`}
         >
            <div className="flex items-center text-3xl">
               {listOfItems.names.map((item:any) => String.fromCodePoint(findItem(item)))}
            </div>
            <div className="flex items-center text-lg">
               <div className="flex items-center text-neutral-400 font-bold space-x-1">
                  <p>{ethers.utils.formatEther(listOfItems.cost).toString()}</p>
                  <FaEthereum/>
               </div>
               <div className="w-14 flex justify-end items-center text-neutral-300 font-bold space-x-1">
                  <p>$ {
                     Math.round(Number(ethers.utils.formatEther(listOfItems.cost).toString()) * ethPrice)
                  }</p>
               </div>
            </div>
         </label>
      </>
   )
}