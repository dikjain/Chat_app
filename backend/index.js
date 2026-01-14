import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './db/db.js';
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from './Middleware/errorMiddleWare.js';
import chatRoute from './routes/chatRoutes.js';
import messageRoute from './routes/messageRoutes.js';
import statusRoute from './routes/statusRoute.js';
import { Server } from "socket.io";
import http from 'http';
import path from 'path';
import { initializeSocket } from './socket/socketHandler.js';


dotenv.config();

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://chat-app-3-2cid.onrender.com'] 
    : ['http://localhost:3000','http://localhost:3001','http://localhost:3002', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

const __dirname = path.resolve();
app.use("/upload", express.static(path.join(__dirname, "/backend/uploads")));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/status", statusRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 100000,
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] INFO: Server running on port ${PORT}`);
  connectDB();
});
