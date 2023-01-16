import React from "react"

interface Props {
   inputValue: string,
   label: string
}

const Field:React.FC<Props> = ({
   inputValue,
   label
}) => {
   return (
      <div className="flex flex-col">
         <h2>{label}</h2>
         <input 
            type="text" 
            placeholder="Name"
            className="text-input"
            value={inputValue}
         />
      </div>
   )
}

export default Field
