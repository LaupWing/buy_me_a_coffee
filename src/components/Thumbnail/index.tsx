import React from "react"
import { Control } from "react-hook-form"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   thumbnail: ImageListType,
   control: Control<any>
   onThumbnailChange: (image:ImageListType) => void
}

const Thumbnail:React.FC<Props> = ({
   onThumbnailChange,
   thumbnail
}) => {

   return (
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
   )
}

export default Thumbnail