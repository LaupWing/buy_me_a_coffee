import React from "react"
import { Control, Controller, FieldErrorsImpl } from "react-hook-form"
import { BsFillCameraFill } from "react-icons/bs"
import ImageUploading from "react-images-uploading"
import { ExportInterface, ImageListType } from "react-images-uploading/dist/typings"
import { FormValues } from "../../pages/create"
import Upload from "./Upload"

export interface ThumbnailProps {
   control: Control<FormValues>
   errors: Partial<FieldErrorsImpl<FormValues>>
}

const Thumbnail:React.FC<ThumbnailProps> = ({
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
                     {errors.thumbnail && <p className="error z-40 p-2 absolute">{errors.thumbnail.message}</p>}
                     {errors.profile && <p className="error z-40 p-2 absolute bottom-0 right-60">{errors.profile.message}</p>}
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

export interface CurrentProps {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void,
   image: ImageListType
}

const Current:React.FC<CurrentProps> = ({ dragProps, onImageUpload }) => {
   return (
      <button
         className="z-40 m-auto"
         onClick={onImageUpload}
         {...dragProps}
         type="button"
      >
         <BsFillCameraFill
            className="text-white" 
            size={30}
         />
      </button>
   )
}