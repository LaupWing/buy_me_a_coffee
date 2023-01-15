import { createSlice } from "@reduxjs/toolkit"
import { BuyMeACoffeeFactory, BuyMeACoffee } from "../../backend/typechain-types"

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
   reducers: {}
})

export default contractsSlice.reducer