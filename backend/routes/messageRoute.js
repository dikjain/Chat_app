import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { sendMessage,allMessages,deleteMessage } from "../controller/message.controller.js";

const router = express.Router();


router.post('/', protect,sendMessage);
router.get('/:chatId', protect,allMessages);
router.post('/delete', protect,deleteMessage);


export default router