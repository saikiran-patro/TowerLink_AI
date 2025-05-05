import { createSlice } from "@reduxjs/toolkit";

const systemSlice= createSlice({
    name:'system',
    initialState:{
        name: 'Tower Link'
    },
    reducers:{
        setSystem: (state,action) => {
            return action.payload
        }
    }
})

export const {setSystem}=systemSlice.actions
export default systemSlice.reducer;