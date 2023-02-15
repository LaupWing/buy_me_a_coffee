import { NextPage } from "next"
import { FC, useEffect } from "react"
import { 
   Control, 
   Controller, 
   SubmitHandler, 
   useForm, 
} from "react-hook-form"
import { ImageListType } from "react-images-uploading"
import { ItemsType } from "types"
import { Field, IconCamera } from "~/components"
import useCampaign from "~/hooks/useCampaign"
import { gateWay } from "~/utils/ipfs"
import ImageUploading from "react-images-uploading"

export interface FormValues {
   description: string
   name: string
   listOfItems: ListOfItems
   profile: ImageListType
   thumbnail: ImageListType
}

export type ListOfItems = ItemsType[]

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
   } = useForm<FormValues>({
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
      }
   }, [_campaign.campaign])

   if(!_campaign.loaded){
      return <div>Loading..</div>
   }

   const onSubmit:SubmitHandler<FormValues> = ({thumbnail}) => {
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
         <main className="mt-16 bg-white max-w-2xl mx-auto p-10 rounded border shadow">
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
         </main>
      </form>
   )
}
export default Campaign

interface EditCampaignThumbnailProps {
   control: Control<FormValues>
}

const EditCampaignThumbnail:FC<EditCampaignThumbnailProps> = ({
   control
}) => {
   return (
      <Controller
         control={control}
         name="thumbnail"
         render={({ field }) => {
            return(
               <ImageUploading 
                  multiple={false}
                  value={field.value}
                  onChange={(image) => field.onChange(image)}
               >
                  {({ onImageUpload }) => {
                     return field.value ? (
                        <>
                           <img 
                              src={field.value[0].dataURL}  
                              className="w-full h-60 object-cover"
                              alt="thumbnail from campaign" 
                           />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <button
                                 className="z-40 m-auto"
                                 onClick={onImageUpload}
                                 type="button"
                              >
                                 <IconCamera
                                    className="text-white" 
                                    size={30}
                                 />
                              </button>
                           </div>
                        </>
                     ) : null
                  }}
               </ImageUploading>
            )
         }}
      />
   )
}

interface EditCampaignProfileProps {
   control: Control<FormValues>
}

const EditCampaignProfile:FC<EditCampaignProfileProps> = ({
   control
}) => {
   return (
      <Controller
         control={control}
         name="profile"
         render={({ field }) => {
            return (
               <ImageUploading
                  multiple={false}
                  value={field.value}
                  onChange={(image) => field.onChange(image)}
               >
                  {({ onImageUpload }) => {
                     return field.value ? (
                        <button 
                           className="absolute bottom-0 rounded-full overflow-hidden left-1/2 w-36 h-36 transform -translate-x-1/2 translate-y-1/3 border-[5px] border-white"
                           onClick={onImageUpload}
                        >
                           <img 
                              className="object-cover"
                              src={field.value[0].dataURL} 
                              alt="profile picture" 
                           />
                           <div className="inset-0 absolute text-white flex items-center justify-center bg-black/20">
                              <IconCamera size={30}/>
                           </div>
                        </button>
                     ) : null
                  }}
               </ImageUploading>
            )
         }}
      />
   )
}