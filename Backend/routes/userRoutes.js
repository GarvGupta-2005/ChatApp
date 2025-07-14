import express from 'express'
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import { protectRoue } from '../middlewares/auth.js';

const userRouter = express.Router();



//Sign Up
userRouter.post("/signup",signup)
//login 
userRouter.post("/login",login)
//Update profile
userRouter.put("/update-profile",protectRoue,updateProfile);
//Get data
userRouter.get("/check",protectRoue,checkAuth)

export default userRouter