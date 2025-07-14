import jwt from 'jsonwebtoken'
import User from '../models/User.js';

//Middleware to protect routes

// export const protectRoue = async (req, res, next) => {
//     try {
//         const token = req.headers.token;

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.userId).select("-password");

//         if (!user) {
//             return res.json({ success: false, message: "The User Does not exist" })
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }
// }

export const protectRoue = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};


