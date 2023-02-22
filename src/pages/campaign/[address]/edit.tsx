import { NextPage } from "next"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { 
   Control,
   Controller,
   SubmitHandler, 
   useForm, 
} from "react-hook-form"
import { ImageListType } from "react-images-uploading"
import { ItemsType } from "types"
import { 
   AddItemsForm,
   CurrentListOfItems,
   DeletedListedItems,
   EditProfile, 
   EditThumbnail, 
   Field, 
   IconTrashcan, 
   IconUndo, 
   Items, 
   LoadingOverlay
} from "~/components"
import useCampaign from "~/hooks/useCampaign"
import { gateWay } from "~/utils/ipfs"
import { parseItems } from "~/lib/utils"
import axios from "axios"
import { useAppSelector } from "~/store/hooks"
import { PinataPinResponse } from "@pinata/sdk"
import { parseListOfItems } from "~/utils/parsers"
import { toast } from "react-toastify"
import { ethers } from "ethers"

export interface EditFormValues {
   description: string
   name: string
   listOfItems: ItemsType[]
   profile: ImageListType
   thumbnail: ImageListType
}

const Campaign:NextPage = () => {
   const _campaign = useCampaign()
   const [deletedItems, setDeletedItems] = useState<ItemsType[]>([])
   const [loading, setLoading] = useState<boolean>(false)
   const [addedItems, setAddedItems] = useState<ItemsType[]>([])
   const { account } = useAppSelector(state => state.web3)

   const { 
      register,
      control,
      setValue,
      getValues,
      setError,
      formState: {
         errors
      },
      handleSubmit
   } = useForm<EditFormValues>({
      defaultValues: {
         name: undefined,
         description: undefined,
         thumbnail: undefined,
         profile: undefined,
         listOfItems: []
      },
   })

   useEffect(() => {
      const init = async () =>{
         await _campaign.loadCampaign()
      }
      init()
   },[])
   
   useEffect(() => {
      if(_campaign.campaign){
         setValue("name", _campaign.campaign?.name!)
         setValue("description", _campaign.campaign?.description!)
         setValue("thumbnail", [{
            dataURL: gateWay + _campaign.campaign?.thumbnail!
         }])
         setValue("profile", [{
            dataURL: gateWay + _campaign.campaign?.profile!
         }])
         setValue("listOfItems", _campaign.campaign?.listOfItems.map(parseItems))
      }
   }, [_campaign.campaign])

   if(!_campaign.loaded){
      return <div>Loading..</div>
   }

   const addListOfItems = (listOfItems: ItemsType) => {
      const {listOfItems:prev} = getValues()
      setValue("listOfItems", [...prev, listOfItems])
      setError("listOfItems", {
         type: "focus"
      })
   }

   const undo = (listOfItems: ItemsType) => {
      setDeletedItems(prev => [...prev].filter(x => x !== listOfItems))
      addListOfItems(listOfItems)
   }

   const onSubmit:SubmitHandler<EditFormValues> = async ({
      thumbnail, 
      description, 
      name, 
      profile
   }) => {
      setLoading(true)
      const response = await axios.post<{
         profileUri: PinataPinResponse
         thumbnailUri: PinataPinResponse
      }>("/api/pinata", {
         profile: profile[0].file || null,
         thumbnail: thumbnail[0].file || null,
         account
      }, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      })
      
      const {
         all_items, 
         all_values
      } = parseListOfItems(addedItems)
      const transaction = await _campaign.contract?.update(
         name,
         description,
         response.data.profileUri.IpfsHash || profile[0].dataURL!.replace(gateWay, ""),
         response.data.thumbnailUri.IpfsHash || thumbnail[0].dataURL!.replace(gateWay, ""),
         all_items,
         all_values,
         deletedItems.map(x => Number(x.id!))
      )
      await transaction?.wait()
      toast("Succesfully updated!")
      setLoading(false)
   }

   return (
      <div className="my-6 pb-10">
         {loading && <LoadingOverlay message="Updating"/>}
         <div className="relative">
            <EditThumbnail
               control={control}
            />
            <EditProfile
               control={control}
            />
         </div>
         <main className="mt-16 bg-white max-w-4xl mx-auto p-10 rounded border shadow flex flex-col">
            <div className="w-full max-w-md mx-auto text-center flex flex-col space-y-4">
               <Field
                  label="Name"
                  type="name"
                  register={register("name", {
                     required: "Please enter name"
                  })}
                  errors={errors}
               />
               <p className="italic text-neutral-400 font-semibold">{_campaign.campaign?.owner}</p>
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
            <div className="flex flex-col my-10">
               <AddItemsForm addListOfItems={(listOfItems) => {
                  addListOfItems(listOfItems)
                  setAddedItems(prev => [...prev, listOfItems])
               }}/>
               <CurrentListOfItems
                  addedItems={addedItems}
                  control={control}
                  setAddedItems={setAddedItems}
                  setDeletedItems={setDeletedItems}
               />
            </div>
            {deletedItems.length > 0 && (
               <DeletedListedItems 
                  deletedItems={deletedItems}
                  undo={undo}
               />
            )}
            <form className="ml-auto" onSubmit={handleSubmit(onSubmit)}>
               <button className="btn">Submit</button>
            </form>
         </main>
      </div>
   )
}
export default Campaign