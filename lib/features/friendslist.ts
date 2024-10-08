import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse } from '../types/event';

export interface FriendsListState {
   events: MonthlyInvitedEventsResponse[];
}

const initialState: FriendsListState = {
   events: []
};

const friendsListSlice = createSlice({
    name: 'friendlist',
    initialState,
    reducers: {
        updateEvents: (state, action: PayloadAction<MonthlyInvitedEventsResponse[]>) => {
            return {
                events: action.payload,
            };
        },
        
    }
});

export const { updateEvents} = friendsListSlice.actions;
export default friendsListSlice.reducer; // Ensure this exports the reducer
