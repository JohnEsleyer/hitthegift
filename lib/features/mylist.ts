import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse, ServerResponseForEvents } from '../types/event';

export interface MyListState {
   events: ServerResponseForEvents[];
}

const initialState: MyListState = {
   events: [],
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
    }
});

export const { updateMyListEvents } = myListSlice.actions;
export default myListSlice.reducer; // Ensure this exports the reducer
