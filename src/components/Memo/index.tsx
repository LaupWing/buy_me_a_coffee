import { ethers } from "ethers"
import { FaEthereum } from "react-icons/fa"
import { ITEMS } from "../../../constants"
import { useAppSelector } from "../../store/hooks"

const Memo = ({campaign}:any) => {
   const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0
   const { ethPrice } = useAppSelector(state => state.contracts)

   return (
      <div className="w-full mt-6 shadow max-w-lg p-4 border border-neutral-300 rounded mx-auto bg-white">
         <h3 className="text-3xl font-semibold mb-8 text-neutral-600 tracking-tight">Buy {campaign.name} a treat!</h3>
         {campaign && (
            <ul className="flex flex-col space-y-2">
               {campaign.listOfItems.map((listOfItem:any) => (
                  <li 
                     className="flex items-center justify-between rounded bg-yellow-400/5 p-3 border-2 border-yellow-400/30"
                     key={listOfItem.id.toString()}
                  >
                     <div className="flex items-center text-3xl">
                        {listOfItem.names.map((item:any) => String.fromCodePoint(findItem(item)))}
                     </div>
                     <div className="flex items-center text-lg">
                        <div className="flex items-center text-neutral-400 font-bold space-x-1">
                           <p>{ethers.utils.formatEther(listOfItem.cost).toString()}</p>
                           <FaEthereum/>
                        </div>
                        <div className="w-14 flex justify-end items-center text-neutral-300 font-bold space-x-1">
                           <p>$ {
                              Number(ethers.utils.formatEther(listOfItem.cost).toString()) * ethPrice
                           }</p>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         )}
         <div className="my-4 space-y-4">
            <input 
               type="text" 
               className="w-full bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded"
            />
            <textarea className="w-full h-44 resize-none bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded">

            </textarea>
         </div>
      </div>
   )
}
export default Memo