import express from 'express';
import protect from '../Middleware/authMiddleware.js';
import {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
  } from "../controller/chat.controller.js"

const router = express.Router();




router.post("/",protect, accessChat);
router.get("/",protect, fetchChats);
router.post("/group",protect, createGroupChat);
router.put("/rename",protect, renameGroup);
router.put("/groupremove",protect, removeFromGroup);
router.put("/groupadd",protect, addToGroup);


export default router;