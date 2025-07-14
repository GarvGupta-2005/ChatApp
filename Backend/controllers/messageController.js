// import  Promise  from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../index.js";



//get users for side bar
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
 
    // This MUST be an array of promises (map, not forEach!)
    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(" Sidebar fetch failed:", error);
    res.json({ success: false, message: error.message });
  }
};



//get alll messages from selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const markMessagesAsSeen = async (req,res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true});
    } catch (error) {
            console.log(error);
        res.json({success:false,message:error.message})
    }
}


//send messages
export const sendMessage = async (req,res)=>{
    try {

        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id

        let imageURL;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,receiverId,text,image:imageURL
        })

        //Emit the new message to receiver
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverId).emit("newMessage",newMessage)
        }

        res.json({success:true,newMessage})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}