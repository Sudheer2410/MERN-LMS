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

### 2. Frontend Deployment (Static Site)

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `lms-frontend` (or your preferred name)
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (for Vite)
   - **Plan**: Choose appropriate plan

4. Set Environment Variables:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```

5. Click **"Create Static Site"**

### 3. Update Frontend API Configuration

Make sure your frontend is configured to use the production API URL. In your `client/src/api/axiosInstance.js`, ensure it uses the environment variable:

```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 4. Important Notes

- **MongoDB**: Use MongoDB Atlas for production database
- **File Uploads**: Ensure Cloudinary is properly configured
- **CORS**: The backend is already configured to accept requests from your frontend domain
- **Environment Variables**: Never commit sensitive data to your repository

### 5. Testing

After deployment:
1. Test your backend API endpoints
2. Test your frontend application
3. Verify file uploads work
4. Test authentication flows
5. Test payment integration

### 6. Troubleshooting

If you encounter issues:
- Check Render logs for error messages
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check CORS configuration if frontend can't connect to backend

### 7. Custom Domain (Optional)

You can add custom domains to both your backend and frontend services in Render's dashboard under the "Settings" tab. 