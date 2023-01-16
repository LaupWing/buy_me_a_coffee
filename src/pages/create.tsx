import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { useState } from "react"
import Profile from "../components/Profile"
import { FiUpload } from "react-icons/fi"

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
      <div className="mt-10 container bg-white mx-auto rounded-md overflow-hidden shadow">
         <form onSubmit={e => e.preventDefault()} className="w-full flex flex-col">
            <div 
               className="w-full flex bg-center h-52 bg-cover relative border-b-2 border-neutral-300"
               style={{
                  backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
               }}
            >
               <div className="flex flex-col items-center z-50 m-auto bg-white/60 p-4 rounded backdrop-blur-lg">
                  <FiUpload className="text-yellow-400" size={30}/>
                  <p className="text-xs uppercase text-yellow-400 font-bold tracking-wider">Click here to upload a thumbnail</p>
               </div>
               <div className="bg-white/40 absolute inset-0"></div>
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