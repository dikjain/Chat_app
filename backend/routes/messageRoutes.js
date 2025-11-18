import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { sendMessage,allMessages,deleteMessage,ChangeLatestMessage,sendFileMessage } from "../controller/message.controller.js";

const router = express.Router();


router.post('/', protect,sendMessage);
router.post('/upload', protect,sendFileMessage);
router.get('/:chatId', protect,allMessages);
router.post('/delete', protect,deleteMessage);
router.post('/ChangeLatestMessage', protect,ChangeLatestMessage);


export default router