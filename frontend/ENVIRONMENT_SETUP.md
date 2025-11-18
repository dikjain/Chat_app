# Environment Setup Guide

## 🚀 Quick Setup

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Fill in Your Values
Edit the `.env` file with your actual credentials:

```env
# API Configuration
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com

# Google AI (Gemini) Configuration
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# ZEGOCLOUD Video Call Configuration
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_ZEGO_SERVER_SECRET=your_zego_server_secret

# App Configuration
VITE_APP_NAME=Chat App
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
```

## 🔑 Getting API Keys

### Google AI (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `VITE_GOOGLE_AI_API_KEY`

### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard → Settings
3. Copy your Cloud Name to `VITE_CLOUDINARY_CLOUD_NAME`
4. Create an upload preset and copy to `VITE_CLOUDINARY_UPLOAD_PRESET`

### ZEGOCLOUD (Video Calls)
1. Sign up at [ZEGOCLOUD](https://www.zegocloud.com/)
2. Create a new project
3. Copy App ID to `VITE_ZEGO_APP_ID`
4. Copy Server Secret to `VITE_ZEGO_SERVER_SECRET`

## ⚠️ Important Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- All environment variables must start with `VITE_` for Vite to expose them
- The app will show console warnings for missing required variables in development mode
- For production, set `VITE_DEV_MODE=false` and `VITE_ENABLE_LOGGING=false`

## 🔧 Development vs Production

### Development
```env
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
VITE_API_URL=http://localhost:5000
```

### Production
```env
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=false
VITE_API_URL=https://your-production-api.com
```

## 🚨 Security

- Keep your API keys secure and never share them
- Use different keys for development and production
- Regularly rotate your API keys
- Monitor usage in your service dashboards

## 📝 Troubleshooting

### "Missing required environment variables" error
- Check that all required variables are set in your `.env` file
- Ensure variable names start with `VITE_`
- Restart your development server after changing `.env`

### Video calls not working
- Verify your ZEGO credentials are correct
- Check that your ZEGO project is active
- Ensure you have sufficient ZEGO credits

### File uploads failing
- Verify Cloudinary credentials
- Check that your upload preset allows unsigned uploads
- Ensure your Cloudinary account has sufficient storage
