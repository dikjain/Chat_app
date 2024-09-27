import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import chats from "./data/data.js";
import connectDB from './db/db.js';
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from './Middleware/errorMiddleWare.js';
import chatRoute from './routes/chatRoutes.js';
import messageRoute from './routes/messageRoute.js';
import { Server } from "socket.io";  // Import Socket.IO Server
import http from 'http';  // Import http module
import path from 'path';


dotenv.config();

const app = express();

app.use(cors({
    origin: "*", // Replace with your frontend URL
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]  // Add more methods if needed
}));

app.use(express.json());




app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);


const __dirname1 = path.resolve()
app.use(express.static(path.join(__dirname1,"/frontend/dist")))

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname1,"/frontend/dist/index.html")) 
})


app.use(notFound);
app.use(errorHandler);

let OnlineUsers = []
// Socket.IO connectionlet OnlineUsers = [];



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

let currUser




io.on("connection", (socket) => {

  socket.emit("detailde")
  socket.on("dedi",(dat)=>{
    if (!OnlineUsers.includes(dat._id)) {
      OnlineUsers.push(dat._id);
    }
  })
  setTimeout(()=>{
    io.emit("onlineUsers", OnlineUsers);
  },50)
  
  
  
  // Handle setup when a user connects
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Handle joining a chat room
  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // Handle typing events
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

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
    io.emit("onlineUsers", OnlineUsers);
    
  });


 

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});




server.listen(process.env.PORT || 5000, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});













// import express from 'express';
// import dotenv from "dotenv"
// import cors from "cors"
// import chats from "./data/data.js"
// import connectDB from './db/db.js';
// import userRoutes from "./routes/userRoutes.js"
// import { errorHandler, notFound } from './Middleware/errorMiddleWare.js';
// import chatRoute from './routes/chatRoutes.js';
// import messageRoute from './routes/messageRoute.js';

// dotenv.config();

// const app = express();


// app.use(cors({
//     origin: "*", // Replace with your frontend URL
//     credentials: true,
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
//     methods: ["GET", "POST", "PUT", "DELETE"]  // Add more methods if needed
//  }));

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.use("/api/user",userRoutes)
// app.use("/api/chat",chatRoute)
// app.use("/api/message",messageRoute)

// app.use(notFound)
// app.use(errorHandler)

// const servers =  app.listen(process.env.PORT || 5000,()=>{
//     connectDB()
//     console.log(`Server is running on port ${process.env.PORT}`);  // Use environment variable for port if available
// })

// const socket = io(servers)