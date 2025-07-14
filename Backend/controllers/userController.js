import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import cloudinary from "../lib/cloudinary.js"


//Sign up
export const signup = async (req, res) => {

    const { fullName, email, password, bio } = req.body

    try {

        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Details Missing" })
        }

        const exist_user = await User.findOne({ email });
        if (exist_user) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashpassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, message: "Account Created Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: "User Not Found" })
        }

        const isCorrectPassword = await bcrypt.compare(password, userData.password);
        if (!isCorrectPassword) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const token = generateToken(userData._id);
        res.json({ success: true, userData, token, message: "Login Successful" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//checking fro authentication
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })
}

//update profile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, user: updatedUser });
    }
}