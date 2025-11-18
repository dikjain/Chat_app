import expressAsyncHandler from "express-async-handler";
import Status from "../models/status.model.js";
import User from "../models/user.model.js";

const CreateStatus = expressAsyncHandler(async (req, res) => {
    try {
        const { content, mediaUrl, id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const status = await Status.create({
            user: user._id,
            content,
            mediaUrl
        });

        user.status.push(status._id);
        await user.save();
        await user.populate("status");

        res.status(201).json({
            success: true,
            message: "Status created successfully",
            status
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR: Create status failed:`, error.message);
        return res.status(400).json({ success: false, message: "Failed to create status" });
    }
});

const fetchStatus = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const status = await Status.find({ user: id });
        res.status(200).json({
            success: true,
            status
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR: Fetch status failed:`, error.message);
        return res.status(400).json({ success: false, message: "Failed to fetch status" });
    }
});

const deleteStatus = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Status ID is required" });
        }
        await Status.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Status deleted successfully"
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR: Delete status failed:`, error.message);
        return res.status(400).json({ success: false, message: "Failed to delete status" });
    }
});


export { CreateStatus, fetchStatus,deleteStatus };
