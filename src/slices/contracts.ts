import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { BuyMeACoffeeFactory, BuyMeACoffee } from "../../backend/typechain-types"
import { store } from "../store/store"
import { ContractInterface, ethers } from "ethers"
import contractAddresses from "../../constants/networks.json"
import BuyMeACoffeeFactoryAbi from "../../constants/contracts/BuyMeACoffeeFactory.json"

type ChainId = keyof typeof contractAddresses

export interface InitialState {
   buyMeACoffee: BuyMeACoffee|null,
   buyMeACoffeeFactory: BuyMeACoffeeFactory|null
}

const initialState:InitialState = {
   buyMeACoffee: null,
   buyMeACoffeeFactory: null
}

export const contractsSlice = createSlice({
   name: "contracts",
   initialState,
   reducers: {
      setBuyMeACoffeeFactory(state, action:PayloadAction<any>){
         state.buyMeACoffeeFactory = action.payload
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

export const test = 
   () => async (dispatch: Dispatch, getState: typeof store.getState) =>{
      const {buyMeACoffeeFactory} = getState().contracts
      console.log(buyMeACoffeeFactory)
      console.log(buyMeACoffeeFactory?.getSuperUser())
   }

export const {
   setBuyMeACoffeeFactory
} = contractsSlice.actions


export default contractsSlice.reducer