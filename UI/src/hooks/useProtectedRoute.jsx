import React, { useEffect } from 'react';
import { checkAuth } from "../lib/utils.js";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from "../Store/authSlice.js";
import { connectSocket, getSocket } from '../lib/utils.js';
import { setOnlineUsers } from '../Store/chatSlice.js';

const useProtectedRoute = (safeRoute) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [response, data] = await checkAuth();

        if (response) {
          dispatch(auth({
            callsign: data?.fullName,
            callid: data?.email,
            profilePic: data?.profilePicture,
            SpaceTime: data?.createdAt,
            isProfileUpdating: false,
            loggedInUser: data?._id
          }));

          let socket = getSocket();
          if (!socket || !socket.connected) {
            connectSocket(data._id);
            socket = getSocket();
          }

          // ✅ Now safely listen to events after connection
          socket?.on("getOnlineUsers", (userIds) => {

            
            dispatch(setOnlineUsers(userIds));
          });

          navigate('/' + safeRoute);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
        console.error("Error:", error);
      }
    })();
  }, []);
};

export default useProtectedRoute;
