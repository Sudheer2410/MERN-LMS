# MERN LMS Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Quick Setup

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Cloudinary (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: PayPal (for payments)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET_ID=your_paypal_secret_id
```

### 3. Start the Application

```bash
# Start the server (from server directory)
cd server
npm run dev

# Start the client (from client directory)
cd client
npm run dev
```

### 4. Debug Database (Optional)

If you're having issues, run the debug script:

```bash
cd server
node debug.js
```

## Common Issues & Solutions

### 1. "Cannot read properties of null (reading 'courses')"
- **Cause**: Student hasn't bought any courses yet
- **Solution**: ✅ Fixed - now returns empty array instead of error

### 2. 500 Internal Server Error on `/student/courses-bought/get/:id`
- **Cause**: Invalid user ID or authentication issues
- **Solution**: ✅ Fixed - added proper validation and error handling

### 3. 401 Unauthorized Errors
- **Cause**: Authentication issues or invalid tokens
- **Solution**: 
  - Clear browser sessionStorage
  - Log out and log back in
  - Check if JWT_SECRET is properly set

### 4. Featured Courses Not Showing
- **Cause**: No courses in database or API errors
- **Solution**:
  - Check if MongoDB is connected
  - Create some test courses as an instructor
  - Check browser console for API errors

### 5. Dashboard Not Loading
- **Cause**: Authentication or data fetching issues
- **Solution**:
  - Ensure you're logged in as an instructor
  - Check if courses exist in the database
  - Verify API endpoints are working

### 6. Query Parameter Issues (`{ undefined: '' }`)
- **Cause**: Malformed query parameters
- **Solution**: ✅ Fixed - added proper parameter validation

## Recent Fixes Applied

### Server-Side Fixes:
1. **Null Reference Errors**: Fixed in `student-courses-controller.js` and `course-controller.js`
2. **Query Parameter Validation**: Improved in `course-controller.js`
3. **Error Handling**: Enhanced across all controllers
4. **Authentication Validation**: Added proper checks in course progress controller
5. **Configuration**: Centralized environment variables

### Client-Side Fixes:
1. **Authentication Checks**: Added validation before API calls
2. **Error Handling**: Improved error handling in components
3. **useEffect Dependencies**: Fixed dependency arrays
4. **API Call Validation**: Added checks for required parameters

## Testing the Application

1. **Register as an Instructor**:
   - Go to `/auth`
   - Register with role "instructor"
   - Create some courses

2. **Register as a Student**:
   - Go to `/auth`
   - Register with role "user"
   - Browse and purchase courses

3. **Test Features**:
   - Course creation and editing
   - Course browsing and filtering
   - Payment processing (PayPal)
   - Course progress tracking

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/check-auth` - Check authentication status

### Instructor Routes
- `GET /instructor/course/get` - Get instructor's courses
- `POST /instructor/course/add` - Add new course
- `PUT /instructor/course/update/:id` - Update course

### Student Routes
- `GET /student/course/get` - Get all courses
- `GET /student/course/get/details/:id` - Get course details
- `GET /student/courses-bought/get/:studentId` - Get student's purchased courses
- `POST /student/order/create` - Create payment order
- `POST /student/order/capture` - Capture payment

### Course Progress Routes
- `GET /student/course-progress/get/:userId/:courseId` - Get course progress
- `POST /student/course-progress/mark-lecture-viewed` - Mark lecture as viewed
- `POST /student/course-progress/reset-progress` - Reset course progress

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server terminal for error logs
3. Run `node debug.js` in the server directory
4. Verify all environment variables are set correctly
5. Ensure MongoDB is running and accessible

## Debugging

Use the debug script to check your setup:

```bash
cd server
node debug.js
```

This will:
- Test database connection
- Count documents in collections
- Show sample data if available
- Help identify configuration issues 