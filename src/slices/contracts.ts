import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { BuyMeACoffeeFactory, BuyMeACoffee } from "../../backend/typechain-types"
import { store } from "../store/store"
import { ContractInterface, ethers } from "ethers"
import contractAddresses from "../../constants/networks.json"
import BuyMeACoffeeFactoryAbi from "../../constants/contracts/BuyMeACoffeeFactory.json"
import BuyMeACoffeeAbi from "../../constants/contracts/BuyMeACoffee.json"

type ChainId = keyof typeof contractAddresses

export interface InitialState {
   buyMeACoffee: BuyMeACoffee|null,
   buyMeACoffeeFactory: BuyMeACoffeeFactory|null,
   alreadyRegistered: boolean
}

const initialState:InitialState = {
   buyMeACoffee: null,
   buyMeACoffeeFactory: null,
   alreadyRegistered: false
}

export const contractsSlice = createSlice({
   name: "contracts",
   initialState,
   reducers: {
      setBuyMeACoffeeFactory(state, action:PayloadAction<any>){
         state.buyMeACoffeeFactory = action.payload
      },
      setAlreadyRegistered(state, action:PayloadAction<boolean>){
         state.alreadyRegistered = action.payload
      }
   }
})

export const fetchBuyMeACoffeeFactory =
   () => async (dispatch: Dispatch, getState: typeof store.getState) => {
      try {
         const { chainId, signer } = getState().web3
         const addresses = contractAddresses[chainId as ChainId]

         if(!addresses){
            throw new Error("Contract not available on this chain")
         }

         const contract = new ethers.Contract(
            addresses.BuyMeACoffeeFactory[addresses.BuyMeACoffeeFactory.length -1],
            BuyMeACoffeeFactoryAbi as ContractInterface,
            signer
         )

         dispatch(setBuyMeACoffeeFactory(contract))
      } catch(e) {
         console.log(e)
      }
   }

export const fetchBuyMeACoffees =
   () => async (dispatch: Dispatch, getState: typeof store.getState) => {
      try {
         const { buyMeACoffeeFactory } = getState().contracts
         const { signer } = getState().web3
         const addresses = await buyMeACoffeeFactory?.getDeployedBuyMeACoffee() 
         const buyMeCoffeesProxy = addresses?.map(async a => {
            const contract:BuyMeACoffee = new ethers.Contract(
               a, 
               BuyMeACoffeeAbi.abi as ContractInterface, 
               signer
            ) as BuyMeACoffee
            const name = await contract.getName()
            const description = await contract.getDescription()
            const thumbnail = await contract.getThumbnail()
            const profile = await contract.getProfile()
            return {
               name,
               description,
               thumbnail,
               profile,
            }
         }) as Promise<{
            name: string
            description: string,
            thumbnail: string,
            profile: string,
         }>[]
         const buyMeACoffees = await Promise.all(buyMeCoffeesProxy)
         console.log(buyMeACoffees)
      } catch(e) {
         console.log(e)
      }
   }

export const setInitialBuyMeACoffeeFactory = 
   () => async (dispatch: Dispatch, getState: typeof store.getState) =>{
      const {buyMeACoffeeFactory} = getState().contracts
      
      dispatch(setAlreadyRegistered(await buyMeACoffeeFactory?.getGetRegistered()!))
   }

export const {
   setBuyMeACoffeeFactory,
   setAlreadyRegistered
} = contractsSlice.actions


export default contractsSlice.reducer