import React, { useState } from "react"
import { FiUpload } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Profile from "../Profile"
import Current from "./Current"
import Upload from "./Upload"

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
               <>
                  {thumbnail.length > 0 ? (
                     <Current
                        dragProps={dragProps}
                        onImageUpload={onImageUpload}
                        image={thumbnail}
                     />
                  ):(
                     <Upload
                        dragProps={dragProps}
                        onImageUpload={onImageUpload}
                     />
                  )}
               </>
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