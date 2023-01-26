import React from "react"
import { Control, Controller, FieldErrorsImpl } from "react-hook-form"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { FormValues } from "../../pages/create"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   control: Control<any>
   errors: Partial<FieldErrorsImpl<FormValues>>
}

const Thumbnail:React.FC<Props> = ({
   control,
   errors
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
                  <div
                     className={`w-full flex bg-center rounded-t-md border-2 bg-cover ${
                        errors.thumbnail 
                           ? "border-red-500"
                           : ""
                     }`}
                     style={{
                        backgroundImage: field.value 
                           ? `url(${field.value[0].dataURL})`
                           : "url(/assets/images/coffee_thumbnail.jpg)"
                     }}
                  >
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
                  </div>
               )}
            </ImageUploading>
         )}
      />
         
   )
}

export default Thumbnail