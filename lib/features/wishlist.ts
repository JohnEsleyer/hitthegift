import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '../types/products';

export interface WishlistState {
   myWishlist: ProductType[];
}

const initialState: WishlistState = {
   myWishlist: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addProductToStore: (state, action: PayloadAction<ProductType>) => {
            return {
                myWishlist: [
                    ...state.myWishlist,
                    action.payload,
                ],
            };
        },
        
    }
});

export const {addProductToStore} = wishlistSlice.actions;
export default wishlistSlice.reducer; // Ensure this exports the reducer
