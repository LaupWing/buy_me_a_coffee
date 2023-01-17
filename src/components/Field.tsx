import React from "react"
import { FieldErrorsImpl } from "react-hook-form/dist/types";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form"

export interface Props {
   inputValue: string,
   label: string,
   type: string,
   textarea?: boolean,
   register: UseFormRegisterReturn<string>
   errors: Partial<FieldErrorsImpl<{ [x: string]: any; }>>
}

const Field:React.FC<Props> = ({
   inputValue,
   label,
   textarea
}) => {
   return (
      <div className="flex flex-col">
         <h2 className="mb-1 ml-1 text-sm font-bold uppercase tracking-wider text-neutral-400/70">{label}</h2>
         {!textarea ? (
            <input 
               type="text" 
               placeholder="Name"
               className="text-input focus-input"
               value={inputValue}
            />
         ) :(
            <textarea 
               className="bg-neutral-100 p-2 border border-gray-200 outline-none rounded resize-none h-24 focus-input" 
               placeholder="Your amazing description"
            >
            </textarea>
         )}
      </div>
   )
}

export default Field
