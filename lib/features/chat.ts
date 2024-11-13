import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ServerResponseForEvents } from '../types/event';

export interface ChatState {
   showLoading: boolean; // This loading flag is used by the HomeTemplate component to make sure we get the correct conversation Id
}

const initialState: ChatState = {
   showLoading: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        updateShowLoading: ( state, action: PayloadAction<boolean>) => {
            return {
               showLoading: action.payload,
            };
        },
      
    }
});

export const { 
    updateShowLoading
} = chatSlice.actions;
export default chatSlice.reducer; // Ensure this exports the reducer
