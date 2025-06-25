# Deployment Guide for MERN LMS

## Deploy to Render

### 1. Backend Deployment (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `lms-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan (Free tier available)

5. Set Environment Variables:
   ```
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-frontend-app.onrender.com
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET_ID=your_paypal_secret_id
   ```

6. Click **"Create Web Service"**

### 2. Frontend Deployment (Static Site) - **DO THIS AFTER BACKEND IS DEPLOYED**

1. **First, get your backend URL** from the Render dashboard (e.g., `https://lms-backend.onrender.com`)

2. In Render Dashboard, click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `lms-frontend` (or your preferred name)
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (for Vite)
   - **Plan**: Choose appropriate plan

5. **Set Environment Variables** (this is crucial!):
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```
   Replace `your-backend-app.onrender.com` with your actual backend URL from step 1.

6. Click **"Create Static Site"**

### 3. Update Backend CORS (if needed)

If your frontend deployment fails due to CORS issues, update your backend's `CLIENT_URL` environment variable to include your new frontend URL.

### 4. Testing Your Deployment

After both services are deployed:

1. **Test Backend API**:
   - Visit: `https://your-backend-app.onrender.com/auth` (should show some response)
   - Test with Postman or similar tool

2. **Test Frontend**:
   - Visit your frontend URL
   - Try to register/login
   - Test all major features

3. **Common Issues & Solutions**:
   - **Frontend can't connect to backend**: Check `VITE_API_URL` environment variable
   - **CORS errors**: Verify `CLIENT_URL` in backend environment variables
   - **Build fails**: Check if all dependencies are in `package.json`

### 5. Environment Variables Summary

**Backend Environment Variables:**
```
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend-app.onrender.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET_ID=your_paypal_secret_id
```

**Frontend Environment Variables:**
```
VITE_API_URL=https://your-backend-app.onrender.com
```

### 6. Important Notes

- **MongoDB**: Use MongoDB Atlas for production database
- **File Uploads**: Ensure Cloudinary is properly configured
- **CORS**: The backend is already configured to accept requests from your frontend domain
- **Environment Variables**: Never commit sensitive data to your repository
- **Build Process**: Frontend will automatically rebuild when you push changes to GitHub

### 7. Troubleshooting

If you encounter issues:
- Check Render logs for error messages
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check CORS configuration if frontend can't connect to backend
- Make sure backend is fully deployed before deploying frontend

### 8. Custom Domain (Optional)

You can add custom domains to both your backend and frontend services in Render's dashboard under the "Settings" tab. 