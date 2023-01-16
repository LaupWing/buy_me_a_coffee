import React from "react"

interface Props {
   inputValue: string,
   label: string,
   textarea?: boolean
}

const Field:React.FC<Props> = ({
   inputValue,
   label,
   textarea
}) => {
   return (
      <div className="flex flex-col">
         <h2 className="mb-1 ml-1 text-sm font-bold uppercase tracking-wider text-neutral-400">{label}</h2>
         {!textarea ? (
            <input 
               type="text" 
               placeholder="Name"
               className="text-input"
               value={inputValue}
            />
         ) :(
            <textarea>
            </textarea>
         )}
      </div>
   )
}

export default Field
