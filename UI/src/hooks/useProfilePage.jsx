import React,{useState} from 'react'
import { useSelector, useDispatch} from 'react-redux';
import { auth } from '../Store/authSlice.js';
import useProtectedRoute from '../hooks/useProtectedRoute.jsx';
import { WifiOff, SignalLow, SignalMedium, SignalHigh } from "lucide-react";
import { toast } from 'react-toastify';
const useProfilePage = () => {
    useProtectedRoute('profile')
    const data = useSelector(data=>data.auth)
    const system=useSelector(data=>data.system)
    const dispatch= useDispatch()
    const [selectedImage,setSelectedImage]= useState(null)
    const compressImage = (file, maxWidth = 300, maxHeight = 300) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
      
                    canvas.width = maxWidth;
                    canvas.height = maxHeight;
                    ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      
                    resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to JPEG, 70% quality
                };
            };
        });
      };
      
    const updateProfilePicture = async (imgData) => {
    dispatch(auth({...data,isProfileUpdating:true}))
  
    try{
       
        const endpoint = import.meta.env.MODE==="development"? 'http://localhost:5000/api/auth/update-profile' :'/api/auth/update-profile'
        const response = await fetch(endpoint, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(imgData),
        })
        const dataResponse= await response.json();
     
        if(response.ok){
          toast.success("Profile updated successfully")
            dispatch(auth({...data,profilePic:dataResponse?.profilePicture,isProfileUpdating:false}))
        }
        else{
             toast.error(dataResponse.message)
        }
    }
    catch(err){
        dispatch(auth({...data,isProfileUpdating:false}))
        toast.error(err);
    }
   }
    const handleInputImage=async (e)=>{
       const file = e.target.files[0];
       console.log('file', file)
       if(!file) return;
       const compressedBase64 = await compressImage(file);
       setSelectedImage(compressedBase64);
       await updateProfilePicture({ profilePicture: compressedBase64 });
    }
    const getSignalIcon = (signal) => {
        switch (signal) {
          case "strong":
           
            return <SignalHigh className="text-green-500" />;
          case "medium":
           
            return <SignalMedium className="text-yellow-500" />;
          case "weak":
            
            return <SignalLow className="text-red-500" />;
          default:
            
            return <WifiOff className="text-gray-500" />;
        }
      };
  return [data,system,selectedImage,handleInputImage,getSignalIcon];
}

export default useProfilePage