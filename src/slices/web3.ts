import { MetaMaskInpageProvider } from "@metamask/providers"
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { ethers, Signer } from "ethers"
import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider"

declare global {
   interface Window {
      ethereum?: MetaMaskInpageProvider
   }
}

export interface Web3State {
   chainId: string
   signer: Signer|undefined
   provider: Web3Provider|null 
   account: string
}

const initialState:Web3State = {
   account: "",
   chainId: "",
   provider: null,
   signer: undefined
}

export const web3Slice = createSlice({
   name: "web3",
   initialState,
   reducers: {
      setWeb3(state, action:PayloadAction<{
         chainId: string,
         signer: Signer,
         provider: Web3Provider
      }>){
         state.chainId = action.payload.chainId 
         state.signer = action.payload.signer 
         state.provider = action.payload.provider 
      },
      setAccount(state, action:PayloadAction<string>){
         state.account = action.payload
      }
   }
})

export const loadWeb3 =
   () => async (dispatch: Dispatch) => {
      if(!window.ethereum){
         return window.alert("Non-Ethereum browser detected. You should consider trying metamask!")
      }
      const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
      const signer = provider.getSigner()
      const chainId = (await provider.getNetwork()).chainId?.toString()

      window.ethereum.on('accountsChanged', function (accounts) {
         window.location.reload()
      })

      dispatch(setWeb3({
         chainId,
         signer,
         provider
      }))
   }

export const loadAccount = 
   () => async (dispatch: Dispatch) => {
      const accounts = await window.ethereum?.request<string[]>({
         method: "eth_accounts"
      })
      
      if(accounts!.length > 0){
         dispatch(setAccount(accounts![0]!))
      }
   }

export const connectWallet = 
   () => async (dispatch: Dispatch) => {
      const accounts = await window.ethereum?.request<string[]>({
         method: "eth_requestAccounts"
      })
      dispatch(setAccount(accounts![0]!))
   }

export const {
   setWeb3,
   setAccount
} = web3Slice.actions

export default web3Slice.reducer