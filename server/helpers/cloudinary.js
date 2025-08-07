const cloudinary = require("cloudinary").v2;

// Check if Cloudinary credentials are configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// Configure Cloudinary if credentials are available
if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadMediaToCloudinary = async (filePath) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary is not configured. Please set the required environment variables.");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete assest from cloudinary");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
