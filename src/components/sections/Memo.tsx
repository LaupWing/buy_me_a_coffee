import { FC } from "react"
import { ethers } from "ethers"
import { FaEthereum } from "react-icons/fa"
import { ListOfItems } from "../../../typings"
import { useAppSelector } from "~/store/hooks"
import { findItem } from "~/lib/utils"
import { 
   Controller, 
   ControllerRenderProps, 
   SubmitHandler, 
   useForm 
} from "react-hook-form"
import useCampaign from "~/hooks/useCampaign"

interface MemoFormValues {
   message: string
   name: string
   items: string | null
}


export const Memo = () => {
   const campaign = useCampaign()

   const { 
      register,
      formState:{
         errors,
         isValid
      },
      handleSubmit,
      control
    } = useForm<MemoFormValues>({
      defaultValues: {
         name: "",
         message: "",
         items: null
      }
   })

   const submitHandler: SubmitHandler<MemoFormValues> = async ({items, message, name}) => {
      campaign.contract!.storeMemo(name, message, items!, {
         value: campaign.campaign!.listOfItems.find((x:any) => items === x.id.toString()).cost.toString()
      })
   }

   return (
      <form 
         className="w-full mt-6 flex flex-col shadow max-w-lg p-4 border border-neutral-300 rounded mx-auto bg-white"
         onSubmit={handleSubmit(submitHandler)}
      >
         <h3 className="text-3xl font-semibold mb-8 text-neutral-600 tracking-tight">Buy {campaign.campaign!.name} a treat!</h3>
         {campaign.campaign && (
            <Controller
               control={control}
               name="items"
               rules={{
                  required: "Please select the treat!"
               }}
               render={({ field })=>(
                  <>
                     <ul className="flex flex-col space-y-2">
                        {campaign.campaign!.listOfItems.map((listOfItems:ListOfItems) => (
                           <ListOfItems 
                              listOfItems={listOfItems}
                              field={field}
                           />
                        ))}
                     </ul>
                     {errors["items"] && (
                        <p className="error">
                           {errors["items"].message}
                        </p>
                     )}
                  </>
               )}
            />
         )}
         <div className="my-4">
            <input 
               type="text" 
               className="w-full bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded"
               {...register("name", {
                  required: "Please enter your name :)",
               })}
               placeholder="Name"
            />
            {errors["name"] && (
               <p className="error">
                  {errors["name"].message}
               </p>
            )}
            <textarea 
               className="w-full mt-4 h-44 resize-none bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded"
               {...register("message", {
                  required: "Please enter your message :)",
               })}
               placeholder="Message"
            >
            </textarea>
            {errors["message"] && (
               <p className="error">
                  {errors["message"].message}
               </p>
            )}
         </div>
         <button className={isValid ? "btn" : "btn-disabled"}>
            Support
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