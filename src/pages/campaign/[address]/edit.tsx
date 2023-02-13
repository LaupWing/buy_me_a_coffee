import { NextPage } from "next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { ImageListType } from "react-images-uploading"
import { ItemsType } from "types"
import { Field } from "~/components"
import useCampaign from "~/hooks/useCampaign"
import { gateWay } from "~/utils/ipfs"

export interface FormValues {
   description: string
   name: string
   listOfItems: ListOfItems
   profile: ImageListType | string
   thumbnail: ImageListType | string
}

export type ListOfItems = ItemsType[]

const Campaign:NextPage = () => {
   const _campaign = useCampaign()

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
         name: _campaign.campaign?.name,
         description: "",
         thumbnail: gateWay + _campaign.campaign?.thumbnail,
         profile: gateWay + _campaign.campaign?.profile,
         listOfItems: []
      },
   })
   useEffect(() => {
      const init = async () =>{
         await _campaign.loadCampaign()
         setValue("description", _campaign.campaign?.description!)
      }
      init()
   },[])

   if(!_campaign.loaded){
      return <div>Loading..</div>
   }


   return (
      <div className="my-6 pb-10">
         <div className="relative">
            <img 
               src={gateWay + _campaign.campaign?.thumbnail}  
               className="w-full h-60 object-cover"
               alt="thumbnail from campaign" 
            />
            <img 
               className="absolute bottom-0 rounded-full overflow-hidden left-1/2 w-36 h-36 object-cover transform -translate-x-1/2 translate-y-1/3 border-[5px] border-white"
               src={gateWay + _campaign.campaign?.profile} 
               alt="profile picture" 
            />
         </div>
         <main className="mt-16">
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
      </div>
   )
}
export default Campaign