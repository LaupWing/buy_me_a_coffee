import { FC } from "react"
import { ethers } from "ethers"
import { FaEthereum } from "react-icons/fa"
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

interface MemoFormValues {
   message: string
   name: string
   items: string | null
}


export const AvailableItems = () => {
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
         <h3 className="text-3xl font-semibold mb-8 text-neutral-600 tracking-tight">Edit items</h3>
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
      </form>
   )
}

interface ListOfItemsProps {
   listOfItems: ListOfItems
   field: ControllerRenderProps<MemoFormValues, "items">
}

const ListOfItems:FC<ListOfItemsProps> = ({
   listOfItems
}) => {
   const { ethPrice } = useAppSelector(state => state.contracts)
   return (
      <div 
         className="flex items-center border-yellow-400/30 bg-yellow-400/5 justify-between rounded p-3 border-2"
         key={listOfItems.id.toString()}
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
      </div>
   )
}