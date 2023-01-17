import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import { ImageListType } from "react-images-uploading"
import { useState } from "react"
import Thumbnail from "../components/Thumbnail"
import { useForm } from "react-hook-form"

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered } = useAppSelector(state => state.contracts)
   const [profile, setProfile] = useState<ImageListType>([])
   const [thumbnail, setThumbnail] = useState<ImageListType>([])
   const { 
      register,
      formState: {
         errors
      },
      handleSubmit
    } = useForm()

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

   return (
      <div className="mt-10 container bg-white mx-auto rounded-md overflow-hidden shadow">
         <form onSubmit={e => e.preventDefault()} className="w-full flex flex-col">
            <Thumbnail
               onThumbnailChange={onThumbnailChange}
               thumbnail={thumbnail}
               onProfileChange={onProfileChange}
               profile={profile}
            />
            <div className="flex px-6 py-12 flex-col space-y-8 max-w-lg">
               <Field
                  inputValue=""
                  label="Name"
                  type="name"
                  register={register("name", {
                     required: "Please enter name"
                  })}
                  errors={errors}
               />
               {/* <Field
                  inputValue=""
                  label="Description"
                  textarea
               /> */}
            </div>
            <button className="btn m-6 mt-2 ml-auto">Create campaign</button>
         </form>
      </div>
   )
}

export default Create