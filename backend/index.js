import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import chats from "./data/data.js";
import connectDB from './db/db.js';
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from './Middleware/errorMiddleWare.js';
import chatRoute from './routes/chatRoutes.js';
import messageRoute from './routes/messageRoute.js';
import statusRoute from './routes/statusRoute.js';
import { Server } from "socket.io";  // Import Socket.IO Server
import http from 'http';  // Import http module
import path from 'path';
import { log } from 'console';
import { setInterval } from 'timers/promises';


dotenv.config();

const app = express();

app.use(cors({
    origin: "*", // Replace with your frontend URL
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]  // Add more methods if needed
}));

app.use(express.json());
const __dirname2 = path.resolve();
app.use("/upload", express.static(path.join(__dirname2, "/backend/uploads")));



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/status", statusRoute);


const __dirname1 = path.resolve()
app.use(express.static(path.join(__dirname1,"/frontend/dist")))

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname1,"/frontend/dist/index.html")) 
})


app.use(notFound);
app.use(errorHandler);

let OnlineUsers = []
let VideoCallUsers = []

// Create http server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  pingTimeout : 100000,
  cors: {
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {

  socket.emit("detailde")
  socket.on("dedi",(dat)=>{
    if (!OnlineUsers.includes(dat._id)) {
      OnlineUsers.push(dat._id);
    }
  })
  setTimeout(()=>{
    io.emit("onlineUsers", OnlineUsers);
  },1250)

  socket.on("koihai", () => {
    setTimeout(() => {
      socket.emit("videoCallUsers", VideoCallUsers);
    }, 1250);
  });
  
  socket.on("Video_join", (data) => {
    const { selectedChat, user } = data;
  
    // Check if the user is already in the VideoCallUsers
    if (!VideoCallUsers.some(callUser => callUser.user._id === user._id)) {
      VideoCallUsers.push(data);
    }
  
    // Ensure selectedChat and its users are defined
    if (!selectedChat || !selectedChat.users) {
      return console.log("selectedChat or selectedChat.users not defined");
    }
  
    // Notify other users in the chat about the new user joining
    selectedChat.users.forEach((chatUser) => {
      if (chatUser._id !== user._id) {
        setTimeout(() => {
          io.to(chatUser._id).emit("join_hua", VideoCallUsers);
        }, 1250);
        setTimeout(() => {
          io.to(chatUser._id).emit("join_hua", VideoCallUsers);
        }, 1750);
      }
    });
  });
  
  socket.on("Video_leave", (data) => {
    const { selectedChat, user } = data;
  
    // Remove the user from VideoCallUsers
    VideoCallUsers = VideoCallUsers.filter(callUser => callUser.user._id !== user._id);
  
    // Ensure selectedChat and its users are defined before notifying
    if (!selectedChat || !selectedChat.users) {
      return console.log("selectedChat or selectedChat.users not defined");
    }
  
    // Notify other users in the chat about the user leaving
    selectedChat.users.forEach((chatUser) => {
        setTimeout(() => {
          io.to(chatUser._id).emit("leave_hua", VideoCallUsers);
        }, 1250);
        setTimeout(() => {
          io.to(chatUser._id).emit("leave_hua", VideoCallUsers);
        }, 1750);
    });
  });
  
  // Handle setup when a user connects
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Handle joining a chat room
  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // Handle new message
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  
  socket.on("userDisconnected", (usera) => {
    OnlineUsers = OnlineUsers.filter(user => user !== usera._id);
    setTimeout(()=>{
      io.emit("onlineUsers", OnlineUsers);
    },1250)
  });

  // Handle user reconnection
  socket.on("userReconnected", (usera) => {
    if (!OnlineUsers.includes(usera._id)) {
      OnlineUsers.push(usera._id);
    }
    setTimeout(() => {
      io.emit("onlineUsers", OnlineUsers);
    }, 1250);
  });
  



  // Handle disconnection
  socket.on("disconnect", () => {
    const user = OnlineUsers.find(user => user.socketId === socket.id);
    if (user) {
      OnlineUsers = OnlineUsers.filter(u => u.socketId !== socket.id);
      setTimeout(() => {
        io.emit("onlineUsers", OnlineUsers);
      }, 750);
    }
  });
  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});


setInterval(() => {
    let areyouonline = []
    io.emit("areyouonline");
    io.on("iamonline", (data) => {
      if (!areyouonline.includes(data)) {
        areyouonline.push(data);
      }
    });
    setTimeout(() => {
      io.emit("onlineUsers", areyouonline);
      areyouonline = [];
    }, 1000);
  }, 15000);
  

app.use((req, res, next) => {
  res.redirect('/');
});

server.listen(process.env.PORT || 5000, () => {
  connectDB();
});