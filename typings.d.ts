import { BigNumber } from "ethers"

export interface CampaignType {
   name: string
   description: string
   thumbnail: string
   profile?: string
   address?: string
   owner?: string
   listOfItems: ListOfItem[]
}

export interface ItemsType {
   items: string[],
   value: number
}

export interface ItemsTypeFetched {
   names: string[],
   cost: BigNumber
   id: BigNumber
}

export interface ListOfItems {
   id: BigNumber
   names: string[]
   cost: BigNumber
}

export interface MemoType {
   items_id: BigNumber
   message: string
   timestamp: BigNumber
   from: string
}

export interface MemoTypeWithItems extends MemoType {
   items: ItemsTypeFetched
}