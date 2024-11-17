import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '../types/friend';
import { FriendRequestServerResponse } from '../types/friendrequest';

export interface FriendsSidebarState {
    toDeleteFriend: string; // ID of friend
    toDeleteFriendRequest:string; // ID of FriendRequest record
    isSidebarOpen: boolean; // used at products section, disable clicking of products while friends sidebar is open
    friends: Friend[];
    friendRequests: FriendRequestServerResponse[]
}

const initialState: FriendsSidebarState = {
   toDeleteFriend: '',
   toDeleteFriendRequest: '',
   isSidebarOpen: true,
   friends: [],
   friendRequests: [],
};

const friendsSidebarSlice = createSlice({
    name: 'friendlistpage',
    initialState,
    reducers: {
        updateToDeleteFriend: (state, action: PayloadAction<string>) => {
            return {
                ...state, 
                toDeleteFriend: action.payload,
            }
        },
        updateToDeleteFriendRequest: (state, action: PayloadAction<string>) => {
            return {
                ...state, 
                toDeleteFriendRequest: action.payload,
            }
        },
        updateIsSidebarOpen: (state, action: PayloadAction<boolean>)=> {
            return {
                ...state,
                isSidebarOpen: action.payload,
            }
        },
        updateFriends: (state, action: PayloadAction<Friend[]>) => {
            return{
                ...state,
                friends: action.payload,
            }
        },
        updateFriendRequests: (state, action: PayloadAction<FriendRequestServerResponse[]>) => {
            return {
                ...state,
                friendRequests: action.payload,
            }
        }
    }
});

export const { 
    updateToDeleteFriend, 
    updateToDeleteFriendRequest, 
    updateIsSidebarOpen,
    updateFriends,
    updateFriendRequests,
 } = friendsSidebarSlice.actions;
export default friendsSidebarSlice.reducer; // Ensure this exports the reducer
