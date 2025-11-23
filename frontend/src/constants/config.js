// Environment Configuration
const isDevelopment = import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV;
const PROD_API_URL = 'https://chat-app-3-2cid.onrender.com';
const DEV_API_URL = 'http://localhost:3000';

export const config = {
  API_URL: isDevelopment 
    ? (import.meta.env.VITE_API_URL || DEV_API_URL)
    : (import.meta.env.VITE_API_URL || PROD_API_URL),
  SOCKET_URL: isDevelopment 
    ? (import.meta.env.VITE_SOCKET_URL || DEV_API_URL)
    : (import.meta.env.VITE_SOCKET_URL || PROD_API_URL),
  
  // Google AI (Gemini) Configuration
  GOOGLE_AI_API_KEY: import.meta.env.VITE_GOOGLE_AI_API_KEY,
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Chat App',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development Configuration
  DEV_MODE: isDevelopment,
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
};

export const validateConfig = () => {
  const requiredVars = [
    'GOOGLE_AI_API_KEY',
    'CLOUDINARY_CLOUD_NAME', 
    'CLOUDINARY_UPLOAD_PRESET'
  ];
  
  const missing = requiredVars.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    if (config.DEV_MODE) {
      console.warn('Running in development mode with missing environment variables');
    }
  }
  
  return missing.length === 0;
};

// Log configuration in development mode
if (config.DEV_MODE && config.ENABLE_LOGGING) {
  console.log('App Configuration:', {
    ...config,
    GOOGLE_AI_API_KEY: config.GOOGLE_AI_API_KEY ? '***' : 'NOT SET'
  });
}
