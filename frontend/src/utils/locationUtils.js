export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // Check permission status if Permissions API is available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          reject(new Error("Location permission denied. Please enable location access in your browser settings to share your location."));
          return;
        }
        // Continue with location request
        requestLocation(resolve, reject);
      }).catch(() => {
        // If permission query fails, continue with location request anyway
        requestLocation(resolve, reject);
      });
    } else {
      // If Permissions API is not available, proceed directly
      requestLocation(resolve, reject);
    }
  });
};

const requestLocation = (resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      resolve(locationUrl);
    },
    (error) => {
      // Handle different geolocation error codes
      // Error codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
      let errorMessage;
      const errorCode = error.code;
      
      // Log error for debugging (can be removed in production)
      console.log('Geolocation error details:', {
        code: errorCode,
        message: error.message,
        fullError: error
      });
      
      // Use numeric codes directly (more reliable across browsers)
      // Error codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
      if (errorCode === 1) {
        errorMessage = "Location permission denied. Please enable location access in your browser settings to share your location.";
      } else if (errorCode === 2) {
        errorMessage = "Location information is unavailable. Please check your device's location settings and ensure location services are enabled on your device.";
      } else if (errorCode === 3) {
        errorMessage = "Location request timed out. Please try again.";
      } else {
        // For unknown errors, show the actual error message
        errorMessage = `Failed to get location: ${error.message || 'Unknown error occurred'}`;
      }
      
      reject(new Error(errorMessage));
    },
    {
      enableHighAccuracy: false, // Changed to false for faster response
      timeout: 15000, // Increased timeout to 15 seconds
      maximumAge: 60000 // Allow cached location up to 1 minute old
    }
  );
};

export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};

