import React, { useEffect, useState } from "react"
import { SiBuymeacoffee } from "react-icons/si"
import { BiSearchAlt } from "react-icons/bi"
import { connectWallet, loadAccount, loadWeb3 } from "../slices/web3"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchBuyMeACoffeeFactory, fetchCampaigns, setInitialBuyMeACoffeeFactory } from "../slices/contracts"
import Link from "next/link"

const Layout:React.FC<React.PropsWithChildren> = ({children}) => {
   const dispatch = useAppDispatch()
   const { account } = useAppSelector(state => state.web3)
   const { alreadyRegistered } = useAppSelector(state => state.contracts)
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
         await dispatch(setInitialBuyMeACoffeeFactory())
         await dispatch(fetchCampaigns())
      }
      if(account){
         fetchContracts()
      }
   }, [account])

   return (
      <div className="w-screen h-screen bg-neutral-100 flex flex-col">
         {loaded ? (
            <>
            <header className="bg-white container p-4 flex rounded-lg shadow mt-4">
               <Link href={"/"}>
                  <div className="text-neutral-700">
                     <SiBuymeacoffee size={30}/>
                  </div>
               </Link>
               <div className="flex items-center ml-auto space-x-6">
                  { account ? (
                     <>
                        <BiSearchAlt
                           className="text-gray-400 hover:text-yellow-400 duration-200 cursor-pointer" 
                           size={30}
                        />
                        { alreadyRegistered ? (
                           <button 
                              className="btn"
                              onClick={()=> dispatch(setInitialBuyMeACoffeeFactory())}
                           >
                              My Coffees
                           </button>
                        ) :(
                           <Link href={"/create"}>
                              <button 
                                 className="btn"
                                 onClick={()=> dispatch(setInitialBuyMeACoffeeFactory())}
                              >
                                 Create
                              </button>
                           </Link>
                        ) }
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
