import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse, ServerResponseForEvents } from '../types/event';


// States for /mylist page
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
        insertMyListEvent: (state, action: PayloadAction<ServerResponseForEvents>) => {
            return {
                events: [
                    ...state.events,
                    action.payload,
                ]
            }
        }
    }
});

export const { updateMyListEvents, insertMyListEvent } = myListSlice.actions;
export default myListSlice.reducer; // Ensure this exports the reducer
