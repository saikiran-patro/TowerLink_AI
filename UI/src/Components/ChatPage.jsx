import React, { useEffect, useRef} from 'react';
import Navbar from './Navbar.jsx';
import useSignalStore from '../hooks/useSignalStore.jsx';
import useProtectedRoute from '../hooks/useProtectedRoute.jsx';
import ChatList from './ChatList.jsx';
import ChatScreen from './ChatScreen.jsx';
import UiContext from '../lib/UiContext.js';
const ChatPage = () => {
    useProtectedRoute('chat')
 
   const navBarRef = useRef()
   const { users, getUsers, getMessages } = useSignalStore();
        

    return(
        <>
            <Navbar ref={navBarRef} />
            <UiContext.Provider value={{navBarRef:navBarRef}} >
            <div className='flex flex-row w-[100%]'>
                <ChatList  getMessages={getMessages} />
                <ChatScreen />
            </div>
            </UiContext.Provider>
        </> 
    ) 
};

export default ChatPage;
