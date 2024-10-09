import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, MonthlyInvitedEventsResponse } from '../types/event';

export interface FriendsListState {
   events: MonthlyInvitedEventsResponse[];
   toDeleteFriend: string; // ID of friends to delete
}

const initialState: FriendsListState = {
   events: [],
   toDeleteFriend: '',
};

const friendsListSlice = createSlice({
    name: 'friendlist',
    initialState,
    reducers: {
        updateEvents: (state, action: PayloadAction<MonthlyInvitedEventsResponse[]>) => {
            return {
                ...state,
                events: action.payload,
            };
        },
        updateToDeleteFriend: (state, action: PayloadAction<string>) => {
            return {
                ...state, 
                toDeleteFriend: action.payload,
            }
        }
        
    }
});

export const { updateEvents, updateToDeleteFriend} = friendsListSlice.actions;
export default friendsListSlice.reducer; // Ensure this exports the reducer
