import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { BuyMeACoffeeFactory, BuyMeACoffee } from "../../backend/typechain-types"
import { store } from "../store/store"
import { ContractInterface, ethers } from "ethers"
import contractAddresses from "../../constants/networks.json"
import BuyMeACoffeeFactoryAbi from "../../constants/contracts/BuyMeACoffeeFactory.json"
import BuyMeACoffeeAbi from "../../constants/contracts/BuyMeACoffee.json"
import { CampaignType } from "types"

type ChainId = keyof typeof contractAddresses

export interface InitialState {
   buyMeACoffee: BuyMeACoffee|null,
   buyMeACoffeeFactory: BuyMeACoffeeFactory|null,
   alreadyRegistered: boolean,
   campaigns: CampaignType[],
   ethPrice: number,
   myCampaignAddress: null | string
}

const initialState:InitialState = {
   buyMeACoffee: null,
   buyMeACoffeeFactory: null,
   alreadyRegistered: false,
   campaigns: [],
   ethPrice: 0,
   myCampaignAddress: null
}

export const contractsSlice = createSlice({
   name: "contracts",
   initialState,
   reducers: {
      setBuyMeACoffeeFactory(state, action:PayloadAction<any>){
         state.buyMeACoffeeFactory = action.payload
      },
      setBuyMeACoffee(state, action:PayloadAction<any>){
         state.buyMeACoffee = action.payload
      },
      setCampaigns(state, action:PayloadAction<CampaignType[]>){
         state.campaigns = action.payload
      },
      setEthPrice(state, action:PayloadAction<number>){
         state.ethPrice = action.payload
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

export const fetchBuyMeACoffee =
   (address: string) => async (_: Dispatch, getState: typeof store.getState):Promise<BuyMeACoffee> => {
      const { signer } = getState().web3

      const contract = new ethers.Contract(
         address,
         BuyMeACoffeeAbi.abi as ContractInterface,
         signer
      )

      return contract as BuyMeACoffee
   }

export const fetchEthPrice =
   () => async (dispatch:Dispatch, getState: typeof store.getState) => {
      try {
         const { buyMeACoffeeFactory } = getState().contracts
         const ethPrice = await buyMeACoffeeFactory?.getLatestPrice()
         const decimals = await buyMeACoffeeFactory?.getDecimals()
         
         const finalPrice = ethPrice?.div(ethers.BigNumber.from(10).pow(decimals!)).toString()
         dispatch(setEthPrice(Number(finalPrice)))
      } catch(e) {
         console.log(e)
      }
   }

export const fetchCampaigns =
   () => async (dispatch: Dispatch, getState: typeof store.getState) => {
      try {
         const { buyMeACoffeeFactory } = getState().contracts
         const { signer } = getState().web3
         const addresses = await buyMeACoffeeFactory?.getDeployedBuyMeACoffee() 
         const buyMeCoffeesProxy = addresses?.map(async address => {
            const contract:BuyMeACoffee = new ethers.Contract(
               address, 
               BuyMeACoffeeAbi.abi as ContractInterface, 
               signer
            ) as BuyMeACoffee
            const name = await contract.getName()
            const description = await contract.getDescription()
            const thumbnail = await contract.getThumbnail()
            const profile = await contract.getProfile()
            const owner = await contract.getOwner()
            return {
               address,
               name,
               description,
               thumbnail,
               profile,
               owner
            }
         }) as Promise<CampaignType>[]
         const buyMeACoffees = await Promise.all(buyMeCoffeesProxy)
         
         dispatch(setCampaigns(buyMeACoffees))
      } catch(e) {
         console.log(e)
      }
   }

export const setInitialBuyMeACoffeeFactory = 
   () => async (dispatch: Dispatch, getState: typeof store.getState) =>{
      const {buyMeACoffeeFactory} = getState().contracts
      const isRegistered = await buyMeACoffeeFactory?.getRegistered()!
      dispatch(setAlreadyRegistered(isRegistered))

      if(isRegistered){
         const campaignAddress = await buyMeACoffeeFactory?.getCampaignOfUser()
         console.log(campaignAddress)
      }
   }

export const {
   setBuyMeACoffeeFactory,
   setAlreadyRegistered,
   setEthPrice,
   setCampaigns
} = contractsSlice.actions


export default contractsSlice.reducer