import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { Server } from "socket.io"; // Import socket.io
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN
}))

app.use(cookieParser())
app.use(express.json())


app.use("/api/v1/users",userRoutes)
app.use("/api/v1/chats",chatRoutes)
const PORT = process.env.PORT||4000;
const server = app.listen(PORT ,()=>{
    connectDB()
    console.log(`Server listening at ${PORT}`);
})



// Socket.io setup
const io = new Server(server, {
    pingTimeout: 80000,
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      userData && socket.join(userData._id);
      socket.emit("connected");
      console.log("websocket connected!!");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("user joined Room: " + room);
    });
  
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) {
        console.log("chat users not defined");
      }
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) {
          return;
        }
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      console.log("user Disconnected");
      socket.leave(userData._id);
    });
  });