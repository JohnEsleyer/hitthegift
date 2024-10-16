import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse, ServerResponseForEvents } from '../types/event';

export interface ProductImageUploadState {
   base64Image: string;
}

const initialState: ProductImageUploadState = {
   base64Image: ''
};

const productImageUploadSlice = createSlice({
    name: 'productImageUpload',
    initialState,
    reducers: {
        updateBase64Image: (state, action: PayloadAction<string>) => {
            return {
                base64Image: action.payload,
            };
        },
    }
});

export const { updateBase64Image } = productImageUploadSlice.actions;
export default productImageUploadSlice.reducer; // Ensure this exports the reducer
