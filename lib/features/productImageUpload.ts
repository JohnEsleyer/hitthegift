import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductImageUploadState {
   base64Image: string;
   amazonImageUrl: string; // used to display produce image directly from Amazon CDN
}

const initialState: ProductImageUploadState = {
   base64Image: '',
   amazonImageUrl: '',
};

const productImageUploadSlice = createSlice({
    name: 'productImageUpload',
    initialState,
    reducers: {
        updateBase64Image: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                base64Image: action.payload,
            };
        },
        updateAmazonImageUrl: (state,action: PayloadAction<string>) => {
            return {
                ...state,
                amazonImageUrl: action.payload,
            }
        }
    }
});

export const { updateBase64Image, updateAmazonImageUrl } = productImageUploadSlice.actions;
export default productImageUploadSlice.reducer; // Ensure this exports the reducer
