import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { sendMessage,allMessages,deleteMessage,ChangeLatestMessage,sendFileMessage } from "../controller/message.controller.js";
import uploadMiddleware from "../Middleware/Multer.js";

const router = express.Router();


router.post('/', protect,sendMessage);
router.post('/upload', protect,uploadMiddleware,sendFileMessage);
router.get('/:chatId', protect,allMessages);
router.post('/delete', protect,deleteMessage);
router.post('/ChangeLatestMessage', protect,ChangeLatestMessage);


export default router