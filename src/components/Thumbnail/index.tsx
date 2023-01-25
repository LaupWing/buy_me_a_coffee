import React, { useState } from "react"
import { Control } from "react-hook-form"
import { FiUpload } from "react-icons/fi"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Profile from "../Profile"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   profile: ImageListType,
   onProfileChange: (image:ImageListType) => void
   thumbnail: ImageListType,
   control: Control<any>
   onThumbnailChange: (image:ImageListType) => void
}

const Thumbnail:React.FC<Props> = ({
   onProfileChange,
   profile,
   onThumbnailChange,
   thumbnail
}) => {

   return (
      <div className="w-full flex h-52 bg-cover relative border-b-2 border-neutral-300">
         <ImageUploading 
            multiple={false}
            value={thumbnail}
            onChange={onThumbnailChange}
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