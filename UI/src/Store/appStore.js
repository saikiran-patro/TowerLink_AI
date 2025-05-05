import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import systemReducer from './systemSlice'
import chatReducer from './chatSlice'
const appStore= configureStore(
 {
    reducer: {
        auth: authReducer,
        system: systemReducer,
        chat: chatReducer,
    },
    
 }
)



export default appStore;