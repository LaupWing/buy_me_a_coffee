import { NextPage } from "next"
import { useEffect } from "react"
import { 
   SubmitHandler, 
   useForm, 
} from "react-hook-form"
import { ImageListType } from "react-images-uploading"
import { ItemsType } from "types"
import { 
   AddItemsForm,
   EditCampaignProfile, 
   EditCampaignThumbnail, 
   Field, 
   IconTrashcan, 
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

   const { 
      register,
      control,
      setValue,
      formState: {
         errors
      },
      handleSubmit
   } = useForm<EditFormValues>({
      defaultValues: {
         name: "",
         description: "",
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
         console.log(_campaign.campaign?.listOfItems)
      }
   }, [_campaign.campaign])

   if(!_campaign.loaded){
      return <div>Loading..</div>
   }

   const onSubmit:SubmitHandler<EditFormValues> = ({thumbnail}) => {
      console.log(thumbnail)
   } 

   return (
      <form 
         className="my-6 pb-10"
         onSubmit={handleSubmit(onSubmit)}
      >
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
               <AddItemsForm addListOfItems={() => {}}/>
               <ul className="flex flex-col space-y-2">
                  {_campaign.campaign!.listOfItems
                     .map(parseItems)
                     .map((listOfItems:any) => (
                        <li className="border-2 rounded divide-x-2 items-stretch flex">
                           <Items 
                              {...listOfItems}
                           />
                           <div className="flex text-red-400 items-center px-4 cursor-pointer hover:bg-red-400 duration-200 hover:text-white">
                              <IconTrashcan 
                                 size={20}
                              />
                           </div>
                        </li>
                     ))}
               </ul>
            </div>
            <button className="btn ml-auto">Submit</button>
         </main>
      </form>
   )
}
export default Campaign