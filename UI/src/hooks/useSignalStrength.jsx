import React, {useState, useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux';

import { setSystem } from '../Store/systemSlice'
const useSignalStrength = () => {
  
    const [signal, setSignal] = useState("strong");
    const dispatch = useDispatch();
    const system = useSelector(data=>data.system)
    const checkInternetSpeed = async () => {
      const testUrl = "https://www.google.com/generate_204"; // Very lightweight request
      const startTime = performance.now();
    
      try {
        await fetch(testUrl, { mode: "no-cors", cache: "no-store" });
        const endTime = performance.now();
        const latency = endTime - startTime; // Time in ms
    
        // Estimate speed based on latency (not exact Mbps)
        if (latency < 100) return 10; // Strong signal (10+ Mbps)
        if (latency < 300) return 5; // Medium signal (3-10 Mbps)
        if (latency < 800) return 1; // Weak signal (0.5-3 Mbps)
        return 0; // Offline
      } catch (error) {
        return 0; // No internet
      }
    };
    
    
    
    useEffect(() => {
      // Function to check internet speed and set signal strength
      const updateSignalStrength = async () => {
        const speed = await checkInternetSpeed(); // Function to measure speed
  
        if (speed > 6) setSignal("strong");
        else if (speed > 3) setSignal("medium");
        else if (speed > 0.5) setSignal("weak");
        else setSignal("offline");
      };
  
      updateSignalStrength(); // Initial check
      const intervalSignal = setInterval(updateSignalStrength, 5000); // Update every 5 sec
  
      return () => clearInterval(intervalSignal);
    }, []);
    useEffect(() => {
        dispatch(setSystem({ ...system,signal })); // Dispatch signal strength to Redux store when it changes
    },[signal]);
    return signal;
}

export default useSignalStrength