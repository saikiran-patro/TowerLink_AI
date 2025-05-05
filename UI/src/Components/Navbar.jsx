import React,{useState, useEffect,useRef} from 'react'
import Shutdown from './icons/Shutdown.icon.jsx'
import Settings from './icons/Settings.icon.jsx';
import Profile from './icons/Profile.icon.jsx';

import SignalStrength from './SignalStrength.jsx';
import { useSelector } from 'react-redux';
import { CircleUserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSocket, disconnectSocket } from '../lib/utils.js';
const Navbar = ({ref}) => {
  const [time, setTime] = useState('');
  const user = useSelector(state => state.auth);
  
  const handleShutdown = async () => {
    // Add your shutdown logic here
    const endpoint =import.meta.env.MODE==="development"? 'http://localhost:5000/api/auth/logout' : '/api/auth/logout';
    try{
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include', // ✅ Move outside headers
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data= await response.json();
    if(response.ok){
        if(getSocket()?.connected){console.log("disconnecting him"); disconnectSocket(); }
        // Logout successful, redirect to login page
        window.location.href = '/login';
      }
    }
    catch(error){
        console.error('Failed to shutdown:', error)
    }
  }


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime(); // Set initial time 
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  return (
    <div ref={ref} className="flex flex-row justify-between items-center 
      bg-transparent backdrop-blur-sm border border-white/20 shadow-lg 
      p-4 w-full !bg-[#131314] relative z-[2]">
      
      {/* Left Side - Time */}
      <div className='signalViewMob flex flex-row gap-2'><SignalStrength/> <span className="text-white text-xl orbitron-header font-semibold">{time}</span> </div>
     

      {/* Center - Title */}
      <span className="text-white text-xl font-bold orbitron-header">Tower Link</span>

      {/* Right Side - Logout */}
      <div className='flex gap-[15px] justify-center items-center '>
      <span className='userNameMob orbitron-header text-white'>{user?.callsign}</span>
      <div className="avatar">
  <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring !flex justify-center items-center">
   {user?.profilePic? <img src={user.profilePic} alt="user profile"/> : <CircleUserRound className='text-white' />} 
  </div>
</div>
<div className="dropdown dropdown-bottom dropdown-end">
  <div tabIndex={0} role="button" className="btn m-1 bg-transparent"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>   </div>
  <ul tabIndex={0} className="dropdown-content menu  rounded-box z-1 my-5 w-62 p-2 shadow-sm bg-[#131314]">
  <Link  to='/profile'><li><span className='orbitron-header transition-all text-white cursor-pointer hover:text-gray-500'><Profile/> Astro Profile</span></li></Link>
   
     <li><span className="orbitron-header transition-all text-white cursor-pointer hover:text-gray-500" onClick={handleShutdown} title="shutdown">
        <Shutdown  /> Shut Down
      </span></li>
    </ul>
</div>
      </div>
      
    </div>
  )
}

export default Navbar
