import React from "react"
import { Control, Controller } from "react-hook-form"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   image: ImageListType,
   control: Control<any>
   onImageChange: (image:ImageListType) => void
}

const Thumbnail:React.FC<Props> = ({
   onImageChange,
   image,
   control
}) => {

   return (
      <Controller
         name="thumbnail"
         control={control}
         render={({field}) => (
            <ImageUploading 
               multiple={false}
               value={image}
               onChange={onImageChange}
            >
               {({
                  onImageUpload,
                  dragProps
               })=>(
                  <>
                     {console.log(field)}  
                     {image.length > 0 ? (
                        <Current
                           dragProps={dragProps}
                           onImageUpload={onImageUpload}
                           image={image}
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
         )}
      />
         
   )
}

export default Thumbnail