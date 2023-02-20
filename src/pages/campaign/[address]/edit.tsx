import { NextPage } from "next"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { 
   Control,
   Controller,
   ControllerRenderProps,
   SubmitHandler, 
   useForm, 
} from "react-hook-form"
import { ImageListType } from "react-images-uploading"
import { ItemsType, ListOfItems } from "types"
import { 
   AddItemsForm,
   EditCampaignProfile, 
   EditCampaignThumbnail, 
   Field, 
   IconTrashcan, 
   IconUndo, 
   Items 
} from "~/components"
import useCampaign from "~/hooks/useCampaign"
import { gateWay } from "~/utils/ipfs"
import { parseItems } from "~/lib/utils"

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
   const [addedItems, setAddedItems] = useState<ItemsType[]>([])

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
      setAddedItems(prev => [...prev, listOfItems])
   }

   const onSubmit:SubmitHandler<EditFormValues> = ({thumbnail}) => {
      console.log(thumbnail)
   }

   return (
      <div className="my-6 pb-10">
         <div className="relative">
            <EditCampaignThumbnail
               control={control}
            />
            <EditCampaignProfile
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
               <AddItemsForm addListOfItems={addListOfItems}/>
               <CurrentListOfItems 
                  addedItems={addedItems}
                  control={control}
                  setAddedItems={setAddedItems}
                  setDeletedItems={setDeletedItems}
               />
            </div>
            {deletedItems.length > 0 && (
               <div className="my-4 space-y-1">
                  <div className="flex flex-col space-y-0.5">
                     <h2 className="uppercase font-bold text-sm text-red-400">Deleted items</h2>
                     <p className="text-sm text-red-300">This is an list of items that are currently listed in the contract. All of the items below will be removed, therfore the connection between the supporters and the items they bougth will be lost. You can undo this by pressing the undo button.</p>
                  </div>
                  {deletedItems
                     .map((listOfItems) => (
                        <div className="border-2 overflow-hidden bg-gray-100 rounded divide-x-2 items-stretch flex">
                           <Items 
                              {...listOfItems}
                           />
                           <div 
                              className="flex text-blue-400 items-center px-4 cursor-pointer hover:bg-blue-400 duration-200 hover:text-white"
                           >
                              <IconUndo size={20}/>
                           </div>
                        </div>
                     ))}
               </div>
            )}
            <form className="ml-auto" onSubmit={handleSubmit(onSubmit)}>
               <button className="btn">Submit</button>
            </form>
         </main>
      </div>
   )
}
export default Campaign

interface CurrentListOfItemsProps {
   control: Control<EditFormValues>
   addedItems: ItemsType[]
   setAddedItems: Dispatch<SetStateAction<ItemsType[]>>
   setDeletedItems: Dispatch<SetStateAction<ItemsType[]>>
}

const CurrentListOfItems:FC<CurrentListOfItemsProps> = ({
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