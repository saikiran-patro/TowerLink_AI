import User from "../models/users.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import { handleGeminiRequest } from "./gemini.controller.js";
export const getUsersForSidebar = async (req,res) =>{

  try{

    const loggedInUserId= req.user._id;
    const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password");
    if(filteredUsers.length){
        res.status(200).json({message:"Filtered Users",data:filteredUsers})
    }
    else{
        res.status(404).json({message:"No users found"})
    }
  }
  catch(error){
    res.status(500).json({message:"Internal Server Error"})
  }

} 

export const getMessagesForUser = async (req,res) => {

    try{
       const {id:userToChatId} = req.params
       const senderId = req.user._id;
       // find all the messages where senderID is the loggedin user or the his/her contact chat id ;
       /*
       examaple : SenderId --> You(SaiKiran)
       userToChatId --> receiverId --> your friend/contact
       */
        const messages= await Message.find({$or:[
            {senderId:senderId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:senderId}
        ]})
        if(messages){
            res.status(200).json({message:"Messages",data:messages})
        }
        else{
            res.status(404).json({message:"No messages found"})
        }
    }
    catch(error){
  res.status(500).json({message:"Internal Server Error"})     

    }

}

export const sendMessage = async (req,res) => {

   try{
    const {text, image} = req.body;
    const {id:receiverId}= req.params;
  
    const senderId = req.user._id;
    let imageUrl=null;
    if(image){
        
        const uploadToCloudinary= await cloudinary.uploader.upload(image);
        if(uploadToCloudinary){
            imageUrl=uploadToCloudinary.secure_url
        }
        else{
            return res.status(400).json({message:"Failed to upload image"})
        }

        
    }
    
    if(receiverId==='6814b95f888feca42f33f1b1'){
       // sender query
      const newMessageFromSender= new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
      })
      await newMessageFromSender.save();
      const receiverSocketId=  getReceiverSocketId(receiverId)
      if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage",newMessageFromSender);
      }
      res.status(200).json({data:newMessageFromSender});
 
        // Ai service 
        const aiResponse=await handleGeminiRequest({text:text,imageBase64:image})
        if(aiResponse.status || !aiResponse.status){
           
             
           // Ai response query
              const newMessageFromAi = new Message({
                senderId:receiverId,
                receiverId:senderId,
                text:aiResponse?.data,
                image:null
              })    
              await newMessageFromAi.save();
              const receiverSenderId= getReceiverSocketId(senderId);
              if(receiverSenderId){
                io.to(receiverSenderId).emit("newMessage",newMessageFromAi);
              }
             
   return  

              
        }
    
       

    }
    else{

       
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save()
       
        const receiverSocketId=  getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        
        res.status(201).json({message:"Message sent successfully",data:newMessage})

    }
    

   }
   catch(error){
    res.status(500).json({message:"Internal Server Error"})
   }
    
}
