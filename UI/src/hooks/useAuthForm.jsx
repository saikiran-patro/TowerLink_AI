import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { auth } from "../Store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from '../lib/utils.js';

const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURI =import.meta.env.MODE==="development"? 'http://localhost:5000/api':'/api'
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { fullName: formData.fullName, email: formData.email, password: formData.password };

    try {
      const response = await fetch(baseURI + endpoint, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store full user info in Redux
        dispatch(auth({
          callsign: data?.fullName,
          callid: data?.email,
          profilePic: data?.profilePicture,
          SpaceTime: data?.createdAt,
          isProfileUpdating: false,
          loggedInUser: data?._id,
        }));

        const isSocketConnected = getSocket()?.connected;
        if (!isSocketConnected && data?._id) {
          connectSocket(data._id); // Use the _id from backend directly
        }

        navigate("/chat");
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect. Please try again.");
    }
  };

  return [isLogin, setIsLogin, handleChange, handleSubmit, formData];
};

export default useAuthForm;
