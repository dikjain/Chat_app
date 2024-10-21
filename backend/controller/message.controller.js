import expressAsyncHandler from "express-async-handler";
import Message from "../models/message.model.js"
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = expressAsyncHandler(async (req, res) => {
  
  const { content, chatId  } = req.body;
  const file = req.fileMessage;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    file: null
  };

  try {
    
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendFileMessage = expressAsyncHandler(async (req, res) => {
  
  const { chatId, sender, filename, filepath, size, type, timestamp } = req.fileMessage;

  if (!filepath || !chatId) {
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: sender,
    content: null,
    chat: chatId,
    file: filepath // This should be a string, not an object
  };
  try {
    var message = await Message.create(newMessage);
    
    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const deleteMessage = expressAsyncHandler(async (req, res) => {
  try{
    const { messageId } = req.body;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  }catch(error){
    res.status(400);
    throw new Error(error.message);
  }
});

const ChangeLatestMessage = expressAsyncHandler(async (req, res) => {
  const { chatId , latestMessage } = req.body;
  await Chat.findByIdAndUpdate(chatId, { latestMessage: latestMessage });
  res.status(200).json({ message: "Latest message updated successfully" });
});


export { allMessages, sendMessage, deleteMessage , ChangeLatestMessage , sendFileMessage };