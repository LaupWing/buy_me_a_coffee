import React, { useState } from "react"
import { FiUpload } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Profile from "../Profile"

export interface Props {
   profile: ImageListType,
   onProfileChange: (image:ImageListType) => void
}

const Thumbnail:React.FC<Props> = ({
   onProfileChange,
   profile
}) => {
   const [thumbnail, setThumbnail] = useState<ImageListType>([])

   const onImageChange = (image: ImageListType) => {
      setThumbnail(image)
   }

   return (
      <div className="w-full flex h-52 bg-cover relative border-b-2 border-neutral-300">
         <ImageUploading 
            multiple={false}
            value={thumbnail}
            onChange={onImageChange}
         >
            {({
               onImageUpload,
               dragProps
            })=>(
               <div 
                  className="w-full flex bg-center bg-cover"
                  style={{
                     backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
                  }}
               >
                  <button 
                     className="flex space-x-2 items-center z-50 m-auto bg-white/70 p-4 rounded backdrop-blur-lg"
                     onClick={onImageUpload}
                     {...dragProps}
                  >
                     <FiUpload 
                        className="text-yellow-400" 
                        size={30}
                     />
                     <p className="text-xs uppercase text-yellow-400 font-bold tracking-wider">Click here to upload a thumbnail</p>
                  </button>
                  <div className="bg-white/40 absolute inset-0"></div>
               </div>   
            )}
         </ImageUploading>
         <Profile
            image={profile}
            onImageChange={onProfileChange}
         />
      </div>
   )
}

export default Thumbnail