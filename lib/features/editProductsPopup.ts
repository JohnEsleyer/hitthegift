import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '../types/products';

export interface EditProductPopupState {
   id: string; 
   title: string;
   currency: string;
   productUrl: string;
   imageUrl: string;
   description: string;
   price: string;
}

const initialState: EditProductPopupState = {
   id: '',
   title: '',
   currency: '',
   productUrl: '',
   imageUrl: '',
   description: '',
   price: '',
};

const editProductPopupSlice = createSlice({
    name: 'editProductPopup',
    initialState,
    reducers: {
        updateEditProductAll: (state, action: PayloadAction<ProductType>) => {
            return {
                id: action.payload.id,
                title: action.payload.title,
                currency: action.payload.currency,
                productUrl: action.payload.productUrl,
                imageUrl: action.payload.imageUrl,
                description: action.payload.description,
                price: action.payload.price,
            };
        },
        updateEditProductTitle: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                title: action.payload,
            }
        },
        updateEditProductPrice: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                price: action.payload,
            }
        },
        updateEditProductCurrency:(state, action: PayloadAction<string>) => {
            return {
                ...state,
                currency: action.payload,
            }
        },
        updateEditProductProductUrl: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                productUrl: action.payload,
            }
        },
        updateEditProductDescription: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                description: action.payload,
            }
        },
        updateEditProductId: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                id: action.payload,
            }
        },
        updateEditProductImageUrl: (state,action: PayloadAction<string> ) => {
            return {
                ...state,
                imageUrl: action.payload,
            }
        }

    }
});

export const { 
    updateEditProductAll,
    updateEditProductTitle,
    updateEditProductPrice,
    updateEditProductCurrency,
    updateEditProductProductUrl,
    updateEditProductDescription,
    updateEditProductId,
    updateEditProductImageUrl,
} = editProductPopupSlice.actions;
export default editProductPopupSlice.reducer; // Ensure this exports the reducer
