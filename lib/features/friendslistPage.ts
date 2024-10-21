import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, InvitedEventsResponse } from '../types/event';

export interface FriendsListPageState {

    events: InvitedEventsResponse[];
}

const initialState: FriendsListPageState = {
   events: [],

};

const friendsListSlice = createSlice({
    name: 'friendlistpage',
    initialState,
    reducers: {
        updateEvents: (state, action: PayloadAction<InvitedEventsResponse[]>) => {
            return {
                ...state,
                events: action.payload,
            };
        },        
    }
});

export const { updateEvents} = friendsListSlice.actions;
export default friendsListSlice.reducer; // Ensure this exports the reducer
