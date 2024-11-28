import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '../types/friend';
import { ProductType } from '../types/products';
import { UserData } from '../types/user';

type FriendData = {
    hobbyInfo: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    verificationToken: string;
    email: string;
    birthday: string;
}

export interface InsideFriendState {
   friendId: string;
   friends: Friend[];
   products: ProductType[];
   friendData: FriendData | undefined;
   isOpenChatbox: boolean;
   conversationId: string;
}

const initialState: InsideFriendState = {
friendId: '',
   friends: [],
   products: [],
   friendData: undefined,
   isOpenChatbox: false,
   conversationId: '',
};

const insideFriendSlice = createSlice({
    name: 'insideFriend',
    initialState,
    reducers: {
  
        updateIsOpenChatbox: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                isOpenChatbox: action.payload,
            }
        },
        updateConversationId: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                conversationId: action.payload,
            }
        },

        updateFriendsForInsideFriend: (state, action: PayloadAction<Friend[]>) => {
            return {
                ...state,
                friends: action.payload,
            }
        },
        updateProdctsForInsideFriend: (state, action: PayloadAction<ProductType[]>) => {
            return {
                ...state,
                products: action.payload,
            }
        },
        updateFriendData: (state, action: PayloadAction<FriendData>) => {
            return {
                ...state,
                friendData: action.payload as FriendData,
            }
        },
        updateFriendId: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                friendId: action.payload,
            }
        }
    }
});

export const { 
    updateIsOpenChatbox,
    updateConversationId,
    updateFriendsForInsideFriend,
    updateProdctsForInsideFriend,
    updateFriendData,
    updateFriendId, 
} = insideFriendSlice.actions;
export default insideFriendSlice.reducer; // Ensure this exports the reducer
