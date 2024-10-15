import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse, ServerResponseForEvents } from '../types/event';
import { ProductType } from '../types/products';

// States for /mylist page
export interface MyListState {
   events: ServerResponseForEvents[];
   products: ProductType[];
}

const initialState: MyListState = {
   events: [],
   products: [],
};

const myListSlice = createSlice({
    name: 'mylist',
    initialState,
    reducers: {
        updateMyListEvents: (state, action: PayloadAction<ServerResponseForEvents[]>) => {
            return {
                ...state,
                events: action.payload,
            };
        },
        insertMyListEvent: (state, action: PayloadAction<ServerResponseForEvents>) => {
            return {
                ...state,
                events: [
                    ...state.events,
                    action.payload,
                ]
            }
        },
        updateMyListProducts: (state, action: PayloadAction<ProductType[]>) => {
            return {
                ...state,
                products: action.payload,
            };
        },
        insertMyListProduct: (state, action: PayloadAction<ProductType>) => {
            return {
                ...state,
                products: [
                    ...state.products,
                    action.payload,
                ]
            }
        },
        updateProductStore: (state, action: PayloadAction<ProductType>) => {
            const updatedProduct = action.payload;
            state.products = state.products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            );
        }
        
    }
});

export const {
     updateMyListEvents, 
     insertMyListEvent,
     updateMyListProducts, 
     insertMyListProduct,
     updateProductStore,
    } = myListSlice.actions;
export default myListSlice.reducer; // Ensure this exports the reducer
