import { FC } from "react"
import { Control, Controller } from "react-hook-form"
import ImageUploading from "react-images-uploading"
import { FormValues } from "~/pages/campaign/[address]/edit"
import { IconCamera } from "~/components"

interface EditCampaignThumbnailProps {
   control: Control<FormValues>
}

export const EditCampaignThumbnail:FC<EditCampaignThumbnailProps> = ({
   control
}) => {
   return (
      <Controller
         control={control}
         name="thumbnail"
         render={({ field }) => {
            return(
               <ImageUploading 
                  multiple={false}
                  value={field.value}
                  onChange={(image) => field.onChange(image)}
               >
                  {({ onImageUpload }) => {
                     return field.value ? (
                        <>
                           <img 
                              src={field.value[0].dataURL}  
                              className="w-full h-60 object-cover"
                              alt="thumbnail from campaign" 
                           />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <button
                                 className="z-40 m-auto"
                                 onClick={onImageUpload}
                                 type="button"
                              >
                                 <IconCamera
                                    className="text-white" 
                                    size={30}
                                 />
                              </button>
                           </div>
                        </>
                     ) : null
                  }}
               </ImageUploading>
            )
         }}
      />
   )
}