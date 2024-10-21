import multer from "multer";
import path from "path";
import fs from "fs";
import uploadFileToCloudinary from '../utils/Cloudinary.js'; // Import your Cloudinary upload function

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '/backend/uploads/');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

function modifyCloudinaryUrl(url) {
    // Find the index of 'upload/'
    const uploadIndex = url.indexOf('upload/');

    // If 'upload/' is found, insert 'f_auto,q_auto/' after it
    if (uploadIndex !== -1) {
        const modifiedUrl = url.slice(0, uploadIndex + 'upload/'.length) + 'f_auto,q_auto/' + url.slice(uploadIndex + 'upload/'.length);
        return modifiedUrl;
    } else {
        return url; // Return the original URL if 'upload/' is not found
    }
}

const upload = multer({ storage });

const uploadMiddleware = (req, res, next) => {
    upload.single("file")(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "File upload failed" });
        }

        try {
            const filePath = path.join(__dirname, '/backend/uploads/', req.file.filename);
            // Upload file to Cloudinary
            const cloudinaryRes = await uploadFileToCloudinary(filePath);

            if (cloudinaryRes) {
                const fileMessage = {
                    filename: req.file.originalname,  // Original file name
                    filepath: modifyCloudinaryUrl(cloudinaryRes.url),  // Cloudinary URL
                    size: req.file.size,  // File size
                    type: req.file.mimetype,  // File type
                    timestamp: Date.now(),
                    chatId: req.body.chatId,
                    sender: req.body.sender,
                };
                req.fileMessage = fileMessage;
                // Delete the local file after upload to Cloudinary
                fs.unlinkSync(filePath);
            } else {
                console.error("Error uploading file to Cloudinary");
                return res.status(500).json({ error: "Cloudinary upload failed" });
            }

            next();
        } catch (cloudinaryError) {
            console.error(cloudinaryError);
            return res.status(500).json({ error: "Cloudinary upload error" });
        }
    });
};

export default uploadMiddleware;
