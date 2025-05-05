import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUsers,
  addMessage,
  setIsMessageLoading,
  addNewMessage
} from '../Store/chatSlice';
import { useEffect, useCallback } from 'react';
import { getSocket } from '../lib/utils';

const useSignalStore = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.chat.users);
  const selectedUserToChat = useSelector(state => state.chat?.currentSelectedUser?.userId);

  // ✅ Fetch users
  const getUsers = async () => {
    try {
      const endpoint = import.meta.env.MODE==="development"?'http://localhost:5000/api/messages/users':'/api/messages/users'
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const { data } = await response.json();
        dispatch(setUsers(data));
      } else {
        toast.error('Access denied');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch messages
  const getMessages = async (signalUserId) => {
    try {
      dispatch(setIsMessageLoading(true));
      const endpoint= import.meta.env.MODE==="development"?`http://localhost:5000/api/messages/${signalUserId}` : `/api/messages/${signalUserId}`
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const { data } = await response.json();
        dispatch(addMessage(data));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch(setIsMessageLoading(false));
    }
  };

  // ✅ Memoized subscription function
  const subscribeToMessages = useCallback(() => {
    const socket = getSocket();
    if (!socket || !selectedUserToChat) return;

    const handleNewMessage = (newMessage) => {
      // Only add message if it's for the selected chat
      if (
        newMessage.senderId === selectedUserToChat ||
        newMessage.receiverId === selectedUserToChat
      ) {
        dispatch(addNewMessage(newMessage));
      }
    };

    socket.on('newMessage', handleNewMessage);
    console.log('📡 Subscribed to new messages');

    return () => {
      socket.off('newMessage', handleNewMessage);
      console.log('📴 Unsubscribed from messages');
    };
  }, [dispatch, selectedUserToChat]);

  // ✅ Use effect to handle subscription/unsubscription
  useEffect(() => {
    const unsubscribe = subscribeToMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToMessages]);

  // ✅ Load users on mount
  useEffect(() => {
    getUsers();
  }, []);

  return {
    users,
    getUsers,
    getMessages
  };
};

export default useSignalStore;
