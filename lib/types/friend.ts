import { ProductType } from "./products";

export type Friend = {
    id: string;
    firstName: string;
    lastName: string;
}


export interface FriendWithProducts {
    friendId: string;
    friendFirstName: string;
    products: ProductType[];
  }

