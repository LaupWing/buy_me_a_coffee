import { FC } from "react"
import { ITEMS } from "../../../constants"
import { ItemsType } from "types"
import { useAppSelector } from "../../store/hooks"
import { IconEthereum } from "~/components"

export const Items:FC<ItemsType> = ({cost, names}) => {
   const {ethPrice} = useAppSelector(state => state.contracts)
   const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0
   
   return (
      <li className="py-2 px-2 text-2xl flex items-center justify-between text-gray-300 ">
         <div className="flex items-center">
            <IconEthereum className="mr-2" size={24}/>
            <p className="font-bold">{cost}</p>
            <p className="text-base whitespace-pre-wrap opacity-60"> = {Math.round(cost * ethPrice)} USD</p>
         </div>
         <div className="flex items-center">
            {names.map(item => String.fromCodePoint(findItem(item)))}
         </div>
      </li>
   )
}