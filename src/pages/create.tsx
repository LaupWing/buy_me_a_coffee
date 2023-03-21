import { NextPage } from "next"
import { useRouter } from "next/router"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { ImageListType } from "react-images-uploading"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { PinataPinResponse } from "@pinata/sdk"
import { ItemsType } from "types"
import { parseListOfItems } from "../utils/parsers"
import { HashLoader } from "react-spinners"
import { useState } from "react"
import { toast } from "react-toastify"
import { fetchCampaigns, setAlreadyRegistered, setCampaignAddress } from "../slices/contracts"
import { 
   AddItemsForm, 
   Field, 
   IconTrashcan, 
   Items, 
   Profile, 
   Thumbnail 
} from "~/components"

export interface FormValues {
   description: string
   name: string
   listOfItems: ListOfItems
   profile: ImageListType 
   thumbnail: ImageListType
}

export type ListOfItems = ItemsType[]

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered, buyMeACoffeeFactory } = useAppSelector(state => state.contracts)
   const { account } = useAppSelector(state => state.web3)
   const [creating, setCreating] = useState(false)
   const dispatch = useAppDispatch()

   const { 
      register,
      control,
      getValues,
      setValue,
      setError,
      formState: {
         errors
      },
      handleSubmit
   } = useForm<FormValues>({
      defaultValues: {
         name: "",
         description: "",
         thumbnail: undefined,
         profile: undefined,
         listOfItems: []
      },
   })

   if(alreadyRegistered){
      router.push("/")
   }

   const submitHandler:SubmitHandler<FormValues> = async ({
      description, 
      name, 
      listOfItems,
      thumbnail,
      profile
   }) => {
      setCreating(true)
      const {all_items, all_values} = parseListOfItems(listOfItems)
      const response = await axios.post<{
         profileUri: PinataPinResponse
         thumbnailUri: PinataPinResponse
      }>("/api/pinata", {
         profile: profile[0].file,
         thumbnail: thumbnail[0].file,
         account
      }, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      })
      const transaction = await buyMeACoffeeFactory?.createBuyMeACoffee(
         name, 
         description, 
         response.data.profileUri.IpfsHash,
         response.data.thumbnailUri.IpfsHash,
         all_items,
         all_values
      )

      const transactionReceipt = await transaction?.wait()
      const event = transactionReceipt?.events!.find(x => x.event === "BuyMeACoffeeCreated")
      const address = event?.args![0]
      await dispatch(fetchCampaigns())
      toast(`Created at ${address}`)
      dispatch(setAlreadyRegistered(true))
      dispatch(setCampaignAddress(address))
      router.push(`/campaign/${address}`)
      setCreating(false)
   }

   const addListOfItems = (listOfItems: ItemsType) => {
      const {listOfItems:prev} = getValues()
      setValue("listOfItems", [...prev, listOfItems])
      setError("listOfItems", {
         type: "focus"
      })
   }
   
   return (
      <div className="mt-10 container relative bg-white rounded-md overflow-hidden shadow">
         {creating && <div className="bg-white/90 absolute inset-0 z-50 flex items-center justify-center">
            <HashLoader color="#FDE047" size={70}/>
         </div>}
         <div className="w-full flex h-52 bg-cover relative border-b-2 border-neutral-300">
            <Thumbnail
               errors={errors} 
               control={control}
            />
            <Profile
               control={control}
               errors={errors}
            />
         </div>
         <div className="px-6 my-10 mt-16">
            <AddItemsForm addListOfItems={addListOfItems}/>
            {errors.listOfItems && <p className="error">{errors.listOfItems.message?.toString()}</p>}
         </div>
         <form 
            onSubmit={handleSubmit(submitHandler)} 
            className="w-full flex flex-col"
         >
            <div className="flex px-6 flex-col space-y-8 max-w-lg">
               <ul className="flex flex-col space-y-1">
                  <Controller
                     control={control}
                     name="listOfItems"
                     rules={{
                        required: "You need at least one list of items!"
                     }}
                     render={({field}) => (
                        <>
                           {field.value.map((items, i) => (
                              <div 
                                 className="border-2 rounded divide-x-2 items-stretch flex"
                                 key={i}
                              >
                                 <Items 
                                    {...items}
                                 />
                                 <button 
                                    type="button"
                                    className="flex text-red-400 items-center px-4 cursor-pointer hover:bg-red-400 duration-200 hover:text-white"
                                    onClick={() => {
                                       field.onChange(field.value.filter((_, i2) => i !== i2))
                                    }}
                                 >
                                    <IconTrashcan size={20}/>
                                 </button>
                              </div>
                           ))}
                        </>
                     )}
                  />
               </ul>
               <Field
                  label="Name"
                  type="name"
                  register={register("name", {
                     required: "Please enter name"
                  })}
                  errors={errors}
                  />
               <Field
                  type="description"
                  label="Description"
                  textarea
                  register={register("description", {
                     required: "Please enter description"
                  })}
                  errors={errors}
               />
            </div>
            <button 
               className="btn m-6 mt-2 ml-auto"
               type="submit"
            >
               Create campaign
            </button>
         </form>
      </div>
   )
}

export default Create