import React from "react"
import { Control, Controller, FieldErrorsImpl } from "react-hook-form"
import ImageUploading, { ImageListType } from "react-images-uploading"
import { FormValues } from "../../pages/create"
import Current from "./Current"
import Upload from "./Upload"


export interface Props {
   control: Control<FormValues>
   errors: Partial<FieldErrorsImpl<FormValues>>
}

const Profile:React.FC<Props> = ({control}) => {
   return (
      <Controller
         control={control}
         name="profile"
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
                        />
                     )}
                  </>
               )}
            </ImageUploading>

         )}
      />
   )
}

export default Profile
