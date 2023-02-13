import React from "react"
import { Control, Controller, FieldErrorsImpl } from "react-hook-form"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { ExportInterface } from "react-images-uploading/dist/typings"
import { FormValues } from "../../pages/create"
import { IconCamera, IconUpload } from "~/components"


interface ProfileProps {
   control: Control<FormValues>
   errors: Partial<FieldErrorsImpl<FormValues>>
}

export const Profile:React.FC<ProfileProps> = ({control, errors}) => {
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

interface CurrentProps {
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
            <IconCamera size={30}/>
         </div>
      </button>
   )
}

interface UploadProps {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void
   error: boolean
}

const Upload:React.FC<UploadProps> = ({dragProps, onImageUpload, error}) => {
   return (
      <button 
         onClick={onImageUpload}
         className={`w-24 h-24 border-2 flex items-center justify-center rounded-full overflow-hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-cover ${
            error 
               ? "border-red-400" 
               : "border-neutral-300"
         }`}
         style={{
            backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
         }}
         type="button"
         {...dragProps}
      >
         <IconUpload className="text-yellow-400 z-40" size={30}/>
         <div className="bg-white/40 absolute inset-0"></div>
      </button>
   )
}