import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice(   
    {
    name:'Authentication',
    initialState:null,
    reducers:{
        auth: (state,action) => {
            return action.payload
        }
    }
}
)

export const { auth } = authSlice.actions;
export default authSlice.reducer;