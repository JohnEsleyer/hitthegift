import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData, InvitedEventsResponse } from '../types/event';
import { FriendWithProducts } from '../types/friend';

export interface FriendsListPageState {
    events: InvitedEventsResponse[];
    friendsWithProducts: FriendWithProducts[];
    highlightedDates: Date[];
}

const initialState: FriendsListPageState = {
   events: [],
   friendsWithProducts: [],
   highlightedDates: [],
};

const friendsListSlice = createSlice({
    name: 'friendlistpage',
    initialState,
    reducers: {
        updateFriendsListEvents: (state, action: PayloadAction<InvitedEventsResponse[]>) => {
            return {
                ...state,
                events: action.payload,
            };
        },
        updateFriendsWithProducts: (state, action: PayloadAction<FriendWithProducts[]>) => {
            return {
                ...state,
                friendsWithProducts: action.payload,
            }
        },
        updateHighlightedDatesFriendsList: (state, action: PayloadAction<Date[]>) => {
            return {
                ...state,
                highlightedDates: action.payload,
            }
        },
 
    }
});

export const {
     updateFriendsListEvents,
     updateFriendsWithProducts,
     updateHighlightedDatesFriendsList,
    } = friendsListSlice.actions;
export default friendsListSlice.reducer; // Ensure this exports the reducer
