import React, { useState,useRef } from 'react';
import { CircleDot } from 'lucide-react';
import Navbar from './Navbar.jsx';
import { Camera, RadioTower } from 'lucide-react';
import { Link } from 'react-router-dom';
import Profile from './icons/Profile.icon.jsx';
import { Earth } from 'lucide-react';
import avatar from "../assets/Images/avatar.png";
import useProfilePage from '../hooks/useProfilePage.jsx';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
    const [data,system,selectedImage,handleInputImage,getSignalIcon]= useProfilePage()
    const navBarRef = useRef()
  return (
    <div className='text-white'>
        <Navbar ref={navBarRef} />  
        <div className='bg-black flex justify-center items-center'>
            {/* Profile information body */}
            <div className='flex flex-col justify-center items-center w-[50%] rounded-[15px] max-w-[600px] p-[20px] m-[50px] box-content !bg-[#131314] profileContainerMob'>
                <p className='text-[1.5rem] my-2.5 orbitron-header'>Astro Profile</p>
                <span className='orbitron-header-sm'>Your profile information</span>
                <div className='relative mt-[25px] mb-[15px]'>
                    <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 bg-[#b1aaf2]">
                            <img src={selectedImage || data?.profilePic || avatar} alt='avatar'/>
                        </div>
                    </div>
                    <label title='upload image' htmlFor='avatar-upload' className='cursor-pointer absolute right-0 bottom-2.5'>
                        <Camera className='' />
                        <input disabled={data?.isProfileUpdating} type="file" className='hidden cursor-pointer' onChange={handleInputImage} id='avatar-upload' accept="image/*" />
                    </label>
                    
                </div>
                <span className='orbitron-header-sm'>{data?.isProfileUpdating? <span>Updating...</span> : <span>Click the camera icon to update your profile</span>}</span>

                <div className='w-[100%] my-[10px] mt-[30px]'>
                    <p className='orbitron-header flex gap-3 justify-start items-center'><Profile/> Call Sign</p>
                    <p className='orbitron-header-sm p-[5px] px-[10px] my-[10px] border-[1px] border-white rounded-[10px]'>{data?.callsign}</p>
                </div>
                <div className='w-[100%] my-[10px]'>
                    <p className='orbitron-header flex gap-3 justify-start items-center'><RadioTower /> Call Id</p>
                    <p className='orbitron-header-sm p-[5px] px-[10px] my-[10px] border-[1px] border-white rounded-[10px]'>{data?.callid}</p>
                </div>
                <hr style={{
  border: "none",
  height: "2px",
  background: "linear-gradient(to right, #d2cabe, #3d4458)",
  margin: "20px 0px",
  borderRadius: "20px",
  width: "80%",
}} />

<div className='flex flex-row justify-between items-center w-[70%] py-[20px]'>
    <p className='orbitron-header '>Operating Frequency </p><span className='orbitron-header-sm flex justify-center items-center gap-[5px]'>{system.signal}&nbsp;&nbsp;{getSignalIcon(system.signal)}</span>
</div>
<div className='flex flex-row justify-between items-center w-[70%] py-[20px]'>
    <p className='orbitron-header '>Revolving since</p><span className='orbitron-header-sm flex justify-center items-center gap-[5px]'>{data?.SpaceTime?.split('T')[0]}&nbsp;&nbsp;<Earth color='#5CB8E4'/></span>
</div>
<div className='flex flex-row justify-between items-center w-[70%] py-[20px]'>
    <p className='orbitron-header '>Status</p><span className='orbitron-header-sm flex justify-center items-center gap-[5px]'>Active&nbsp;&nbsp;<CircleDot color="#24cc8b" /></span>
</div>
<div className='flex flex-row justify-center items-center w-[70%] py-[20px]'>
    <Link to='/chat' ><button className='text-black cursor-pointer bg-white px-[30px] py-[10px] rounded-3xl flex justify-center items-center' type="button"><ArrowLeft />Back</button></Link>
</div>
            </div>
{/* Dashboard container */}
            <div>
                
            </div>
        </div>    
    </div>
  )
}

export default ProfilePage