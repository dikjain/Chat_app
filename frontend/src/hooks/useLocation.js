import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getCurrentLocation, isGeolocationSupported } from "../utils/locationUtils";

const useLocation = () => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const sendLocation = useCallback(async () => {
    if (!isGeolocationSupported()) {
      const errorMsg = "Geolocation Not Supported";
      toast.error(errorMsg, {
        description: "Your browser does not support geolocation.",
      });
      setLocationError(errorMsg);
      return null;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const locationUrl = await getCurrentLocation();
      setIsGettingLocation(false);
      return locationUrl;
    } catch (error) {
      setIsGettingLocation(false);
      const errorMsg = error.message || "Failed to get location";
      setLocationError(errorMsg);
      toast.error("Location Error", {
        description: errorMsg,
      });
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setLocationError(null);
  }, []);

  return {
    sendLocation,
    isGettingLocation,
    locationError,
    clearError,
    isSupported: isGeolocationSupported(),
  };
};

export default useLocation;

