import React from "react"
import { FieldErrorsImpl } from "react-hook-form/dist/types";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form"

export interface Props {
   label: string,
   type: string,
   textarea?: boolean,
   register: UseFormRegisterReturn<string>
   errors: Partial<FieldErrorsImpl<{ [x: string]: any; }>>
}

export const Field:React.FC<Props> = ({
   label,
   textarea,
   errors,
   type,
   register
}) => {
   return (
      <div className="flex flex-col">
         <h2 className="mb-1 ml-1 text-left text-sm font-bold uppercase tracking-wider text-neutral-400/70">{label}</h2>
         {!textarea ? (
            <input 
               type="text" 
               placeholder="Name"
               className="text-input focus-input"
               {...register}
            />
         ) :(
            <textarea 
               className="bg-neutral-100 p-2 border border-gray-200 outline-none rounded resize-none h-24 focus-input" 
               placeholder="Your amazing description"
               {...register}
            >
            </textarea>
         )}
         {errors[type] && <p className="error">{errors[type]?.message?.toString()}</p>}
      </div>
   )
}