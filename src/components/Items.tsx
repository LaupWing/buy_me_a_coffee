import {FC} from "react"
import { ItemsType } from "../../typings"
import { useAppSelector } from "../store/hooks"

const Items:FC<ItemsType> = ({value, items}) => {
   const {ethPrice} = useAppSelector(state => state.contracts)

   return (
      <li className="py-2 px-6 text-2xl">

      </li>
   )
}
export default Items
