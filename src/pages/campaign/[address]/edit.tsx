import { NextPage } from "next"
import { FC, useEffect, useState } from "react"
import { SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form"
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
   thumbnail: File
}

export type ListOfItems = ItemsType[]

const Campaign:NextPage = () => {
   const _campaign = useCampaign()
   const [loaded, setLoaded] = useState(false)

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
         profile: "",
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
      const setValues = async () => {
         setValue("name", _campaign.campaign?.name!)
         setValue("description", _campaign.campaign?.description!)
         
         setValue("profile", gateWay + _campaign.campaign?.profile!)
         fetch(gateWay + _campaign.campaign?.thumbnail!)
            .then(async response => {
               const contentType = response.headers.get('content-type')
               const blob = await response.blob()
               const file = new File([blob], "thumbnail")
               setValue("thumbnail", file)
               console.log(file)
               console.log(URL.createObjectURL(file))
               setLoaded(true)
               // access file here
            })
      }

      if(_campaign.campaign){
         setValues()
      }
   }, [_campaign.campaign])

   if(!loaded){
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
            <input 
               type="file" 
               className="absolute top-0"
               {...register("thumbnail")}
            />
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
         <button type="submit">Submit</button>
      </form>
   )
}
export default Campaign