import { createSlice } from "@reduxjs/toolkit";

const chatSlice= createSlice({

    name: 'chat',
    initialState: {
        users:[],
        messages: [],
        currentSelectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        onlineUsers:[]
    },
    reducers: {
        setUsers:(state,action)=>{
            state.users=action.payload
            state.isUsersLoading=false
        },
        addMessage: (state, action) => {
           
                state.messages=action.payload
           
          
           
        },
        addNewMessage:(state,action)=>{
          
            state.messages.push(action.payload)
        },
        setCurrentSelectedUser: (state, action) => {
            state.currentSelectedUser = action.payload;
        },
        setIsMessageLoading:(state,action)=>{
            state.isMessagesLoading=action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
        }

    }
})

export const { setUsers, addMessage, setCurrentSelectedUser,setIsMessageLoading,setOnlineUsers, addNewMessage } = chatSlice.actions;
export default chatSlice.reducer;