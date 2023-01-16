import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import { BsCardImage, BsFillCameraFill, BsUpload } from "react-icons/bs"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { useState } from "react"

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
      <div className="mt-10 container bg-white p-6 mx-auto rounded shadow">
         <form onSubmit={e => e.preventDefault()} className="w-full flex flex-col">
            <div className="flex flex-col space-y-8 max-w-lg">
               <ImageUploading
                  multiple={false}
                  value={image}
                  onChange={onImageChange}
               >
                  {({
                     dragProps,
                     onImageUpload
                  })=>(
                     <>
                        {image.length > 0 ? (
                           <button 
                              onClick={onImageUpload}
                              className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 overflow-hidden rounded-full relative"}
                              {...dragProps}
                           >
                              <img 
                                 src={image[0].dataURL} 
                                 className="object-cover"
                                 alt="Profile image" 
                              />
                              <div className="inset-0 absolute text-white flex items-center justify-center bg-black/20">
                                 <BsFillCameraFill size={30}/>
                              </div>
                           </button>
                        ) : (
                           <button 
                              onClick={onImageUpload}
                              className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 rounded-full relative"}
                              {...dragProps}
                           >
                              <BsCardImage size={50}/>
                              <BsUpload size={25} className="text-yellow-400 absolute bottom-0 right-0"/>
                           </button>
                        )}
                     </>
                  )}
               </ImageUploading>
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
            <button className="btn mt-10 ml-auto">Create campaign</button>
         </form>
      </div>
   )
}

export default Create