import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { useState } from "react"
import Profile from "../components/Profile"
import { FiUpload } from "react-icons/fi"
import Thumbnail from "../components/Thumbnail"

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered } = useAppSelector(state => state.contracts)
   const [profile, setProfile] = useState<ImageListType>([])
   const [thumbnail, setThumbnail] = useState<ImageListType>([])

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
      setProfile(imageList)
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
               />
               <Field
                  inputValue=""
                  label="Description"
                  textarea
               />
            </div>
            <button className="btn m-6 mt-2 ml-auto">Create campaign</button>
         </form>
      </div>
   )
}

export default Create