import React from "react";
import { useCallback } from "react";
import useSignalStrength from "../hooks/useSignalStrength";

import { WifiOff, SignalLow, SignalMedium, SignalHigh } from "lucide-react";
const SignalStrength = () => {
  let signal=  useSignalStrength()

 
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

  return <div title={`Signal Strength: ${signal.toLocaleUpperCase()}`}>{getSignalIcon(signal)}</div>;
};

export default SignalStrength;
