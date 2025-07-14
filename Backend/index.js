import express from 'express'
import 'dotenv/config';
import cors from 'cors'
import http from 'http'
import { json } from 'stream/consumers'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import { Server } from 'socket.io'

//creating the server
const app = express()
const server = http.createServer(app)

//initialise socket.io 
export const io = new Server(server, {
    cors: { origin: "*" }
})


//Store online users:
export const userSocketMap = {};//{userId:socketId}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
        socket.join(userId); // ✅ THIS IS THE KEY LINE
    }

    // Emit online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));app.use(cors());

//Creating end point
app.use("/api/status", (req, res) => { res.send("Sever is Live now!!") })
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

await connectDB()

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => { console.log("Server is running on port:" + PORT) });
