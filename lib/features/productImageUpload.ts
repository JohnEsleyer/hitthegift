import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse, ServerResponseForEvents } from '../types/event';

export interface ProductImageUploadState {
   imageUrl: string;
}

const initialState: ProductImageUploadState = {
   imageUrl: ''
};

const productImageUploadSlice = createSlice({
    name: 'productImageUpload',
    initialState,
    reducers: {
        updateImageUrl: (state, action: PayloadAction<string>) => {
            return {
                imageUrl: action.payload,
            };
        },
    }
});

export const { updateImageUrl } = productImageUploadSlice.actions;
export default productImageUploadSlice.reducer; // Ensure this exports the reducer
