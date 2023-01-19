import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import { ImageListType } from "react-images-uploading"
import { useState } from "react"
import Thumbnail from "../components/Thumbnail"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { PinataPinResponse } from "@pinata/sdk"

interface FormValues {
   description: string
   name: string
 }

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered, buyMeACoffeeFactory } = useAppSelector(state => state.contracts)
   const { account } = useAppSelector(state => state.web3)
   const [profile, setProfile] = useState<ImageListType>([])
   const [thumbnail, setThumbnail] = useState<ImageListType>([])
   const [showError, setShowError] = useState(false)
   const [triedSubmit, setTriedSubmit] = useState(false)

   const { 
      register,
      formState: {
         errors
      },
      handleSubmit
    } = useForm<FormValues>()

   if(alreadyRegistered){
      router.push("/")
   }

   const onProfileChange = (
      imageList: ImageListType
   ) => {
      setProfile(imageList)
   }

   const onThumbnailChange = (
      imageList: ImageListType
   ) => {
      setThumbnail(imageList)
   }

   const submitHandler:SubmitHandler<FormValues> = async ({description, name}) => {
      setTriedSubmit(true)
      if(!showError && (profile.length === 0 || thumbnail.length === 0)){
         setShowError(true)
         return
      }
      if(triedSubmit){
         if(profile.length === 0 || thumbnail.length === 0){
            const confirmed = confirm("Either profile or thumbnail is not set are you sure you want to continue?")
            if(confirmed){
               uploadToIpfs(name, description)
            }
         }
      }else{
         uploadToIpfs(name, description)
      }
   }

   const uploadToIpfs = async (name: string, description:string) => {
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
      await buyMeACoffeeFactory?.createBuyMeACoffee(
         name, 
         description, 
         response.data.profileUri.IpfsHash,
         response.data.thumbnailUri.IpfsHash
      )
   }

   return (
      <div className="mt-10 container bg-white mx-auto rounded-md overflow-hidden shadow">
         <form onSubmit={handleSubmit(submitHandler)} className="w-full flex flex-col">
            <Thumbnail
               onThumbnailChange={onThumbnailChange}
               thumbnail={thumbnail}
               onProfileChange={onProfileChange}
               profile={profile}
            />
            <div className="flex px-6 py-12 flex-col space-y-8 max-w-lg">
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
            {(showError && profile.length === 0) && 
               <p className="text-red-400 text-right my-1 pr-6 tracking-wider text-xs uppercase font-bold">
                  Please set your profile otherwise the default would be used
               </p>
            }
            {(showError && thumbnail.length === 0) && 
               <p className="text-red-400 text-right my-1 pr-6 tracking-wider text-xs uppercase font-bold">
                  Please set your thumbnail otherwise the default would be used
               </p>
            }
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