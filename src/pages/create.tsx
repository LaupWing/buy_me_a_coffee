import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import { BsCardImage, BsFillCameraFill, BsUpload } from "react-icons/bs"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { useState } from "react"
import Profile from "../components/Profile"

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered } = useAppSelector(state => state.contracts)
   const [image, setImage] = useState<ImageListType>([])

   if(alreadyRegistered){
      router.push("/")
   }

   const onImageChange = (
      imageList: ImageListType
   ) => {
      setImage(imageList)
   }

   return (
      <div className="mt-10 container bg-white mx-auto rounded overflow-hidden shadow">
         <form onSubmit={e => e.preventDefault()} className="w-full flex flex-col">
            <div 
               className="w-full h-52 bg-cover relative border-b-2 border-neutral-300"
               style={{
                  backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
               }}
            >
               <Profile
                  image={image}
                  onImageChange={onImageChange}
               />
            </div>
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