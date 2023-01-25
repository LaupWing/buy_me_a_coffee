import {FC} from "react"
import { FaEthereum } from "react-icons/fa"
import { ITEMS } from "../../constants"
import { ItemsType } from "../../typings"
import { useAppSelector } from "../store/hooks"

const Items:FC<ItemsType> = ({value, items}) => {
   const {ethPrice} = useAppSelector(state => state.contracts)
   const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0

   return (
      <li className="py-2 px-2 text-2xl flex items-center justify-between text-gray-300 ">
         <div className="flex items-center">
            <FaEthereum className="mr-2" size={24}/>
            <p className="font-bold">{value}</p>
            <p className="text-base whitespace-pre-wrap opacity-60"> = {value * ethPrice} USD</p>
         </div>
         <div className="flex items-center">
            {items.map(item => String.fromCodePoint(findItem(item)))}
         </div>
      </li>
   )
}
export default Items
