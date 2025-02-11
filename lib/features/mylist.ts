import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  ServerResponseForEvents } from '../types/event';
import { ProductType } from '../types/products';

// States for /mylist page
export interface MyListState {
   events: ServerResponseForEvents[];
   products: ProductType[];
   highlightedDates: Date[];
}

const initialState: MyListState = {
   events: [],
   products: [],
   highlightedDates: [],
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
        deleteMyListEventById: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                events: state.events.filter((event) => event.id !== action.payload),
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
              products: state.products ? [...state.products, action.payload] : [action.payload],
            };
          },          
        deleteMyListProductById: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                products: state.products.filter((product) => product.id !== action.payload),
            }
        },
        updateProductStore: (state, action: PayloadAction<ProductType>) => {
            const updatedProduct = action.payload;
            state.products = state.products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            );
        },
        updateEventStore: (state, action: PayloadAction<ServerResponseForEvents>) => {
            const updatedEvent = action.payload;
            state.events = state.events.map((event) => event.id === updatedEvent.id ? updatedEvent : event);
      
        },
        insertHighlightedDate: (state, action: PayloadAction<Date>) => {
            return {
                ...state,
                highlightedDates: [...state.highlightedDates, action.payload],
            }
        },
        updateHighlightedDates: (state, action: PayloadAction<Date[]>) => {
            return {
                ...state,
                highlightedDates: action.payload,
            }
        }
    }
});

export const {
     updateMyListEvents, 
     insertMyListEvent,
     updateMyListProducts, 
     insertMyListProduct,
     updateProductStore,
     updateEventStore,
     deleteMyListProductById,
     deleteMyListEventById,
     updateHighlightedDates,
     insertHighlightedDate,
    } = myListSlice.actions;
export default myListSlice.reducer; // Ensure this exports the reducer
