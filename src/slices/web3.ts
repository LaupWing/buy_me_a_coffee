import { MetaMaskInpageProvider } from "@metamask/providers"
import { createSlice, Dispatch } from "@reduxjs/toolkit"
import { ethers } from "ethers"

declare global {
   interface Window {
      ethereum?: MetaMaskInpageProvider
   }
}

const initialState = {
   account: null,
   chainId: null,
   provider: null
}

export const web3Slice = createSlice({
   name: "web3",
   initialState,
   reducers: {}
})

export const loadWeb3 =
   () => async (dispatch: Dispatch) => {
      if(!window.ethereum){
         return window.alert("Non-Ethereum browser detected. You should consider trying metamask!")
      }
      const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
      const signer = provider.getSigner()
      console.log(signer)
   }

export default web3Slice.reducer