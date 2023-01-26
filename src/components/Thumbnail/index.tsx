import React from "react"
import { Control, Controller, FieldErrorsImpl } from "react-hook-form"
import ImageUploading from "react-images-uploading"
import { FormValues } from "../../pages/create"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   control: Control<FormValues>
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
                           : "border-transparent"
                     }`}
                     style={{
                        backgroundImage: field.value 
                           ? `url(${field.value[0].dataURL})`
                           : "url(/assets/images/coffee_thumbnail.jpg)",
                     }}
                  >
                     {errors.thumbnail && <p className="error z-50 p-2 absolute">{errors.thumbnail.message}</p>}
                     {errors.profile && <p className="error z-50 p-2 absolute bottom-0 right-60">{errors.profile.message}</p>}
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
                     {field.value
                        ? <div className="bg-black/40 absolute inset-0"></div>
                        : <div className="bg-white/40 absolute inset-0"></div>
                  }
                  </div>
               )}
            </ImageUploading>
         )}
      />
         
   )
}

export default Thumbnail