import React, { useEffect, useState } from "react"
import { SiBuymeacoffee } from "react-icons/si"
import { connectWallet, loadAccount, loadWeb3 } from "../slices/web3"
import { useAppDispatch, useAppSelector } from "../store/hooks"

const Layout:React.FC<React.PropsWithChildren> = ({children}) => {
   const dispatch = useAppDispatch()
   const { account } = useAppSelector(state => state.web3)
   const [loaded, setLoaded] = useState(false)

   useEffect(()=>{
      const initialize = async () =>{
         await dispatch(loadWeb3())
         await dispatch(loadAccount())
         setLoaded(true)
      }

      initialize()
   }, [])

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
                        <p className="font-bold text-xs text-neutral-600 tracking-wider capitalize">My Campaigns</p>
                        <button className="btn">My Coffees</button>
                     </>
                  ) : (
                     <>
                        <button 
                           className="btn"
                           onClick={() => dispatch(connectWallet())}
                        >
                           connect
                        </button>
                     </>
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
