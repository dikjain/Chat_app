import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileToCloudinary = async (file) => {
    try {
        if (!file) return null;
        
        // Upload with resource_type 'raw' to handle PDF correctly
        const res = await cloudinary.uploader.upload(file, {
            resource_type: "image", // Ensure raw type for PDFs
            use_filename: true, // Use original file name
            unique_filename: false, // Keep the same filename
            content_disposition: "inline", // To display the PDF in the browser
            format: "pdf", // Explicitly setting format for PDF
        });

        console.log(res); // Use secure URL to serve over HTTPS
        return res;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(file); // Remove file locally if error occurs
        return null;
    }
}

export default uploadFileToCloudinary;
