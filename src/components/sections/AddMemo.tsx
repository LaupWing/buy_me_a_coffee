import { FC } from "react"
import { ethers } from "ethers"
import { ListOfItems } from "types"
import { useAppSelector } from "~/store/hooks"
import { findItem } from "~/lib/utils"
import { 
   Controller, 
   ControllerRenderProps, 
   SubmitHandler, 
   useForm 
} from "react-hook-form"
import useCampaign from "~/hooks/useCampaign"
import { HashLoader } from "react-spinners"
import { useState } from "react"
import { toast } from "react-toastify"
import { IconEthereum } from "~/components"

interface MemoFormValues {
   message: string
   name: string
   items: string | null
}


export const AddMemo = () => {
   const campaign = useCampaign()
   const [loading, setLoading] = useState(false)

   const { 
      register,
      formState:{
         errors,
         isValid,
      },
      reset,
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
      setLoading(true)
      await campaign.contract!.storeMemo(name, message, items!, {
         value: campaign.campaign!.listOfItems.find((x:any) => items === x.id.toString()).cost.toString()
      })
      const setLoadingToFalse = () => {
         setLoading(false)
         campaign.contract!.off("MemoCreated", setLoadingToFalse)
         toast.success("Thank you for supporting me")
         reset()
      }
      campaign.contract!.on("MemoCreated", setLoadingToFalse)
   }

   return (
      <form 
         className="w-full mt-6 flex flex-col relative overflow-hidden shadow max-w-lg p-4 border border-neutral-300 rounded mx-auto bg-white"
         onSubmit={handleSubmit(submitHandler)}
      >
         {loading && (
            <div className="inset-0 absolute bg-white/90 flex items-center justify-center">
               <HashLoader color="#FDE047" size={70}/>
            </div>
         )}
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
                              key={listOfItems.id.toString()}
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
            className={"flex select-none items-center cursor-pointer justify-between rounded p-3 border-2 " +  (checked 
                  ? "border-yellow-400 bg-yellow-400/20"
                  : "border-yellow-400/30 bg-yellow-400/5"
               )
            }
            key={listOfItems.id.toString()}
            htmlFor={`item${listOfItems.id.toString()}`}
            onClick={(e) => {
               if(listOfItems.id.toString() === field.value){
                  field.onChange(null)
                  e.preventDefault()
               }
            }}
         >
            <div className="flex items-center text-3xl">
               {listOfItems.names.map((item:any) => String.fromCodePoint(findItem(item)))}
            </div>
            <div className="flex items-center text-lg">
               <div className="flex items-center text-neutral-400 font-bold space-x-1">
                  <p>{ethers.utils.formatEther(listOfItems.cost).toString()}</p>
                  <IconEthereum/>
               </div>
               <div className="w-20 flex justify-end items-center text-neutral-300 font-bold space-x-1">
                  <p>$ {
                     Math.round(Number(ethers.utils.formatEther(listOfItems.cost).toString()) * ethPrice)
                  }</p>
               </div>
            </div>
         </label>
      </>
   )
}