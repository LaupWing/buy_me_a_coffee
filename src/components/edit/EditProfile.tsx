import { FC } from "react"
import { Control, Controller } from "react-hook-form"
import ImageUploading from "react-images-uploading"
import { EditFormValues } from "~/pages/campaign/[address]/edit"
import { IconCamera } from "~/components"

interface EditCampaignProfileProps {
   control: Control<EditFormValues>
}

export const EditProfile:FC<EditCampaignProfileProps> = ({
   control
}) => {
   return (
      <Controller
         control={control}
         name="profile"
         render={({ field }) => {
            return (
               <ImageUploading
                  multiple={false}
                  value={field.value}
                  onChange={(image) => field.onChange(image)}
               >
                  {({ onImageUpload }) => {
                     return field.value ? (
                        <button 
                           className="absolute bottom-0 rounded-full overflow-hidden left-1/2 w-36 h-36 transform -translate-x-1/2 translate-y-1/3 border-[5px] border-white"
                           onClick={onImageUpload}
                        >
                           <img 
                              className="object-cover"
                              src={field.value[0].dataURL} 
                              alt="profile picture" 
                           />
                           <div className="inset-0 absolute text-white flex items-center justify-center bg-black/20">
                              <IconCamera size={30}/>
                           </div>
                        </button>
                     ) : null
                  }}
               </ImageUploading>
            )
         }}
      />
   )
}