import React, { useEffect, useState } from "react"
import { SiBuymeacoffee } from "react-icons/si"
import { BiSearchAlt } from "react-icons/bi"
import { connectWallet, loadAccount, loadWeb3 } from "../slices/web3"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchBuyMeACoffeeFactory } from "../slices/contracts"

const Layout:React.FC<React.PropsWithChildren> = ({children}) => {
   const dispatch = useAppDispatch()
   const { account } = useAppSelector(state => state.web3)
   const { buyMeACoffeeFactory } = useAppSelector(state => state.contracts)
   const [loaded, setLoaded] = useState(false)

   useEffect(()=>{
      const initialize = async () =>{
         await dispatch(loadWeb3())
         await dispatch(loadAccount())
         setLoaded(true)
      }

      initialize()
   }, [])

   useEffect(() => {
      const fetchContracts = async () => {
         await dispatch(fetchBuyMeACoffeeFactory())
         console.log(await buyMeACoffeeFactory?.getSuperUser())
      }
      if(account){
         fetchContracts()
      }
   }, [account])

   return (
      <div className="w-screen h-screen bg-neutral-100 flex flex-col">
         {loaded ? (
            <>
            <header className="bg-white p-4 flex mx-auto w-full max-w-5xl rounded-lg shadow mt-4">
               <div className="text-neutral-700">
                  <SiBuymeacoffee size={30}/>
               </div>
               <div className="flex items-center ml-auto space-x-6">
                  { account ? (
                     <>
                        <BiSearchAlt
                           className="text-gray-400 hover:text-yellow-400 duration-200 cursor-pointer" 
                           size={30}
                        />
                        <button className="btn">My Coffees</button>
                     </>
                  ) : (
                     <button 
                        className="btn"
                        onClick={() => dispatch(connectWallet())}
                     >
                        connect
                     </button>
                  )}
               </div>
            </header>
            {children}
            </>
         ): (
            <div>Loading...</div>
         )}
      </div>
   )
}

export default Layout
