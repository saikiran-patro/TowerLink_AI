import {Server } from "socket.io"
import http from "http" // This is built in package in NodeJS so no need to install it as dependency 
import express from "express"
import { Socket } from "dgram";

const app=express();
const server= http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // your frontend
      credentials: true,
      methods: ["GET", "POST","PUT"],
    },
  });


export const getReceiverSocketId=(receiverUserId) =>{
   return userSocketMap[receiverUserId];
}
const userSocketMap ={} // {userId:socketId}
io.on("connection",(socket)=>{
    console.log("A user connected",socket.id)
    
    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id
    // io.emit() is used to send events to all the connected clients in the system
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    console.log(userSocketMap)
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    });
})

export {io,app,server,express}