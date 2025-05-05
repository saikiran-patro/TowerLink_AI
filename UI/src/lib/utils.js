import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import { io } from "socket.io-client";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const checkAuth = async () => {
  const endpoint = import.meta.env.MODE==="development"? 'http://localhost:5000/api/auth/check':'/api/auth/check'

  try {
      const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include', // ✅ Move outside headers
          headers: {
              'Content-Type': 'application/json',
          }
      });
      const data= await response.json();
      console.log("Ye hai response",data);
      return [response.ok,data];

  } catch (e) {
     console.log("catch error me hun")
      console.error('Error authenticating:', e);
      return false;
  }
};

export const formatMessageTime = (date) => {
  const messageDate = new Date(date);
  const now = new Date();

  const isToday = messageDate.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  const time = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  if (isToday) {
    return time;
  } else if (isYesterday) {
    return `Yesterday, ${time}`;
  } else {
    const dateString = messageDate.toLocaleDateString("en-GB"); // DD/MM/YYYY
    return `${dateString}, ${time}`;
  }
};



let socket;

export const connectSocket = (authUserId) => {
  const endpoint=import.meta.env.MODE==="development"? 'http://localhost:5000' : '/'
  socket = io(endpoint, { withCredentials: true, query:{
    userId:authUserId
  } });
  socket.connect()

 
};
export const disconnectSocket =()=>{
   socket.disconnect()
}

export const getSocket = () => socket;