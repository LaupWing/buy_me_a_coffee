import { BigNumber } from "ethers"

export interface BuyMeACoffeeType {
   name: string
   description: string,
   thumbnail: string,
   profile: string,
   address: string,
   owner: string,
}

export interface ItemsType {
   items: string[],
   value: number
}

export interface ListOfItem {
   id: BigNumber
   names: string[]
   cost: BigNumber
}