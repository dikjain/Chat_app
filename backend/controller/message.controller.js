import expressAsyncHandler from "express-async-handler";
import Message from "../models/message.model.js"
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ERROR: Fetch messages failed:`, error.message);
    return res.status(400).json({ success: false, message: "Failed to fetch messages" });
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  
  const { content, chatId , type} = req.body;
  const file = req.fileMessage;
  if (!content || !chatId) {
    return res.status(400).json({ success: false, message: "Content and chatId are required" });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    file: null,
    type : `${type ? type : null}`
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ERROR: Send message failed:`, error.message);
    return res.status(400).json({ success: false, message: "Failed to send message" });
  }
});

const sendFileMessage = expressAsyncHandler(async (req, res) => {
  if (!req.fileMessage) {
    return res.status(400).json({ success: false, message: "File upload failed" });
  }
  
  const { chatId, sender, filename, filepath, size, type, timestamp } = req.fileMessage;

  if (!filepath || !chatId) {
    return res.status(400).json({ success: false, message: "Filepath and chatId are required" });
  }
  
  if (!sender) {
    return res.status(400).json({ success: false, message: "Sender information is required" });
  }
  const newMessage = {
    sender: sender,
    content: null,
    chat: chatId,
    file: filepath,
    type : `${type ? type : null}`
  };
  try {
    let message = await Message.create(newMessage);
    
    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ERROR: Send file message failed:`, error.message);
    return res.status(400).json({ success: false, message: "Failed to send file message" });
  }
});


const deleteMessage = expressAsyncHandler(async (req, res) => {
  try{
    const { messageId } = req.body;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  }catch(error){
    console.error(`[${new Date().toISOString()}] ERROR: Delete message failed:`, error.message);
    return res.status(400).json({ success: false, message: "Failed to delete message" });
  }
});

const ChangeLatestMessage = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId , latestMessage } = req.body;
    await Chat.findByIdAndUpdate(chatId, { latestMessage: latestMessage });
    res.status(200).json({ success: true, message: "Latest message updated successfully" });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ERROR: Change latest message failed:`, error.message);
    return res.status(400).json({ success: false, message: "Failed to update latest message" });
  }
});


export { allMessages, sendMessage, deleteMessage , ChangeLatestMessage , sendFileMessage };