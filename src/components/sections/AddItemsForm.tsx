import { FC } from "react"
import { 
   Controller, 
   ControllerRenderProps, 
   SubmitHandler, 
   useForm 
} from "react-hook-form"
import { ITEMS } from "../../../constants"
import { useAppSelector } from "~/store/hooks"
import { IconEthereum } from "~/components"

interface FormValues {
   value: number|null
   names: string[]
}

interface AddItemsFormProps {
   addListOfItems: (props:{
      names: string[],
      value: number
   }) => void 
}

export const AddItemsForm:FC<AddItemsFormProps> = ({addListOfItems}) => {
   const {
      register,
      control,
      reset,
      watch,
      formState: { errors },
      handleSubmit,
   } = useForm<FormValues>({
      defaultValues: {
         names: []
      },
   })
   const value = watch("value")
   const { ethPrice } = useAppSelector(state => state.contracts)

   const submitHandler: SubmitHandler<FormValues> = async ({names, value}) => {
      addListOfItems({names, value:value!})
      reset()
   }

   return (
      <form
         onSubmit={handleSubmit(submitHandler)}
         className="flex border rounded relative px-4 py-2 my-4"
      >
         <div className="absolute top-0 z-40 transform -translate-y-1/2 text-neutral-300 bg-white px-2">1 eth = {ethPrice} USD</div>
         <div className="flex flex-col flex-1">
            <div className="flex items-center flex-1">
               <IconEthereum className="text-gray-300 mr-2" size={30}/>
               <div className="text-2xl relative flex items-center">
                  <input
                     step=".01"
                     type="number"
                     placeholder="Price"
                     className="outline-none border-none focus:ring-0 my-auto mr-auto"
                     {...register("value", {
                        required: "You need to set a value!",
                     })}
                  />
                  {value && <p className="absolute right-8 pointer-events-none text-gray-200">
                     {Math.floor(Number(value) * ethPrice)} USD
                  </p>}
               </div>
            </div>
            {errors.value && (
               <p className="error mt-2">{errors.value.message}</p>
            )}
         </div>
         <div className="flex flex-col">
            <div className="flex space-x-2">
               <Controller
                  control={control}
                  name="names"
                  rules={{
                     required: "You need at least one item!",
                  }}
                  render={({ field }) => (
                     <>
                        {ITEMS.map((item) => 
                           <Item
                              field={field}
                              item={item}
                           />
                        )}
                     </>
                  )}
               />
               <button className="btn ml-4" type="submit">
                  Add
               </button>
            </div>
            {errors.names && (
               <p className="error mt-2">{errors.names.message}</p>
            )}
         </div>
      </form>
   )
}

interface ItemProps {
   item: {
      name: string
      emoji: number
   }
   field: ControllerRenderProps<FormValues, "names"> 
} 

const Item:FC<ItemProps> = ({
   item,
   field
}) => {
   const checked = field.value.find(
      (x) => x === item.name
   )
   return (
      <label
         key={item.name}
         className={`text-4xl cursor-pointer duration-150 ${
            checked
               ? ""
               : "opacity-10 hover:opacity-30"
         }`}
         htmlFor={item.name}
      >
         <input
            type="checkbox"
            id={item.name}
            className="sr-only"
            checked={!!checked}
            onChange={(e) => {
               if (e.target.checked) {
                  field.onChange([
                     ...field.value,
                     item.name,
                  ])
               } else {
                  field.onChange(
                     [...field.value].filter(
                        (val) => val !== item.name
                     )
                  )
               }
            }}
         />
         {String.fromCodePoint(item.emoji)}
      </label>
   )
}