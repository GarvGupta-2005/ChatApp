import express from 'express';
import { protectRoue } from '../middlewares/auth.js';
import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get("/users",protectRoue,getUsersForSidebar);
messageRouter.get("/:id",protectRoue,getMessages);
messageRouter.put("/mark/:id",protectRoue,markMessagesAsSeen)
messageRouter.post("/send/:id",protectRoue,sendMessage)

export default messageRouter;