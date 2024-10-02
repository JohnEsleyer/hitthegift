import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OverlaysState {
   currentOverlay: string;
}

const initialState: OverlaysState = {
   currentOverlay: '',
};

const overlaysSlice = createSlice({
    name: 'overlays',
    initialState,
    reducers: {
        updateCurrentOverlay: (state, action: PayloadAction<string>) => {
            return {
                currentOverlay: action.payload
            };
        },
        
    }
});

export const { updateCurrentOverlay} = overlaysSlice.actions;
export default overlaysSlice.reducer; // Ensure this exports the reducer
