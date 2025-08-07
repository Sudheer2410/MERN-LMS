const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    const result = await uploadMediaToCloudinary(req.file.path);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    // Provide more specific error messages
    let errorMessage = "Error uploading file";
    if (e.message.includes("Cloudinary is not configured")) {
      errorMessage = "File upload service is not configured. Please contact administrator.";
    } else if (e.message.includes("Invalid API credentials")) {
      errorMessage = "File upload service configuration error. Please contact administrator.";
    } else if (e.message.includes("File too large")) {
      errorMessage = "File is too large. Please upload a smaller file.";
    } else if (e.message.includes("ENOENT")) {
      errorMessage = "File not found. Please try uploading again.";
    }

    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Assest deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);

    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
