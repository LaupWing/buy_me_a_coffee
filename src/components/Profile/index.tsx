import React from "react"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Current from "./Current"
import Upload from "./Upload"

export interface Props {
   image: ImageListType,
   onImageChange: any
}

const Profile:React.FC<Props> = ({image, onImageChange}) => {
   return (
      <ImageUploading
         multiple={false}
         value={image}
         onChange={onImageChange}
      >
         {({
            dragProps,
            onImageUpload
         })=>(
            <>
               {image.length > 0 ? (
                  <Current
                     dragProps={dragProps}
                     onImageUpload={onImageUpload}
                     image={image}
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
   )
}

export default Profile
