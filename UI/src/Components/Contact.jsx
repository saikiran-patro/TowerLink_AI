import React from 'react'
import avatar from "../assets/Images/avatar.png";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSelectedUser } from '../Store/chatSlice';
const Contact = ({id,fullName,profilePicture,getMessages}) => {

   const dispatch = useDispatch();
    const onlineUsers= useSelector((data)=>data.chat?.onlineUsers)
    const openChat = (userId,fullName,profilePicture) => {
    // open a new chat window with the given userId
    
    dispatch(setCurrentSelectedUser({userId, fullName, profilePicture}));
    getMessages(userId); // fetch and display messages for the current user
   
    }
   const currentSelectedUser = useSelector((data)=>data.chat.currentSelectedUser);
  


  return (
    <button className={currentSelectedUser?.userId===id? "w-[100%] p-[20px] bg-[#dee1e9] cursor-pointe border-b-[1px] border-[#454545] cursor-pointer" :"w-[100%] p-[20px] cursor-pointe border-b-[1px] border-[#454545] cursor-pointer"} onClick={()=>openChat(id,fullName,profilePicture)}>
       <div className='flex justify-start items-center gap-4.5 '>
        {
            profilePicture? <img src={profilePicture} alt={fullName} className='w-6 h-6 rounded-full' /> : <div className=' bg-white ring-primary ring-offset-base-100 w-6 h-6 rounded-full'><img src={avatar} alt={'user'}  /></div>  // display profile picture or a default circle if none exists
        }
         <div className='flex flex-col justify-start'>
            <span className={currentSelectedUser?.userId===id?'orbitron-header-sm text-black text-left' :'orbitron-header-sm text-white text-left'}>{fullName}</span>
            {(onlineUsers.includes(id) || id==='6814b95f888feca42f33f1b1') && <span className='text-[#328E6E] font-bold text-left orbitron-header-sm '>Active Now</span>}
         </div>
       </div>
    </button>
  )
}

export default Contact