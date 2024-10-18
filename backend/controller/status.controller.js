import expressAsyncHandler from "express-async-handler";
import Status from "../models/status.model.js";
import User from "../models/user.model.js";

const CreateStatus = expressAsyncHandler(async (req, res) => {
    const { content, mediaUrl, id } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Create the status first
    const status = await Status.create({
        user: user._id,
        content,
        mediaUrl
    });

    // Now, push the status ID to the user's status array
    user.status.push(status._id);
    
    // Save the updated user document
    await user.save();

    // Optionally, populate the status field if needed (assuming 'status' is a ref field in the User schema)
    await user.populate("status");

    // Return a success response
    res.status(201).json({
        message: "Status created successfully",
        status
    });
});

const fetchStatus = expressAsyncHandler(async (req, res) => {
    const { id } = req.body;
    const status = await Status.find({ user: id });
    res.status(200).json({
        status
    });
});
const deleteStatus = expressAsyncHandler(async (req, res) => {
    const { id } = req.body;
    await Status.findByIdAndDelete(id);
    res.status(200).json({
        message: "Status deleted successfully"
    });
});


export { CreateStatus, fetchStatus,deleteStatus };
