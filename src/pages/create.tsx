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
      <div className="mt-10 container bg-white mx-auto rounded overflow-hidden shadow">
         <form onSubmit={e => e.preventDefault()} className="w-full flex flex-col">
            <div 
               className="w-full h-52 bg-cover relative border-b-2 border-neutral-300"
               style={{
                  backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
               }}
            >
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
                              className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 overflow-hidden rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3"}
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
                              className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3"}
                              {...dragProps}
                           >
                              <BsCardImage size={50}/>
                              <BsUpload size={25} className="text-yellow-400 absolute bottom-0 right-0"/>
                           </button>
                        )}
                     </>
                  )}
               </ImageUploading>
            </div>
            <div className="flex p-6 flex-col space-y-8 max-w-lg">
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
            <button className="btn m-6 mt-10 ml-auto">Create campaign</button>
         </form>
      </div>
   )
}

export default Create