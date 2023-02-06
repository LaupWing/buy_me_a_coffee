import React from "react"
import { Control, Controller, FieldErrorsImpl } from "react-hook-form"
import { BsFillCameraFill } from "react-icons/bs"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { ExportInterface } from "react-images-uploading/dist/typings"
import { FormValues } from "../../pages/create"
import Upload from "./Upload"


export interface Props {
   control: Control<FormValues>
   errors: Partial<FieldErrorsImpl<FormValues>>
}

export const Profile:React.FC<Props> = ({control, errors}) => {
   return (
      <Controller
         control={control}
         name="profile"
         rules={{
            required: "You need to set a profile!"
         }}
         render={({field})=>(
            <ImageUploading
               multiple={false}
               value={field.value}
               onChange={(image) => field.onChange(image)}
            >
               {({
                  dragProps,
                  onImageUpload
               })=>(
                  <>
                     {field.value ? (
                        <Current
                           dragProps={dragProps}
                           onImageUpload={onImageUpload}
                           image={field.value}
                        />
                     ) : (
                        <Upload
                           dragProps={dragProps}
                           onImageUpload={onImageUpload}
                           error={!!errors[field.name]}
                        />
                     )}
                  </>
               )}
            </ImageUploading>

         )}
      />
   )
}

export interface CurrentProps {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void,
   image: ImageListType
}

const Current:React.FC<CurrentProps> = ({ dragProps, onImageUpload, image }) => {
   return (
      <button 
         onClick={onImageUpload}
         className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 overflow-hidden rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"}
         {...dragProps}
         type="button"
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
   )
}