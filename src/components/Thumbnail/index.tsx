import React from "react"
import { Control, Controller } from "react-hook-form"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   control: Control<any>
}

const Thumbnail:React.FC<Props> = ({
   control
}) => {

   return (
      <Controller
         name="thumbnail"
         control={control}
         rules={{
            required: "You need to set a thumbnail!"
         }}
         render={({field}) => (
            <ImageUploading 
               multiple={false}
               value={field.value}
               onChange={(image) => field.onChange(image)}
            >
               {({
                  onImageUpload,
                  dragProps
               })=>(
                  <>
                     {field.value ? (
                        <Current
                           dragProps={dragProps}
                           onImageUpload={onImageUpload}
                           image={field.value}
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