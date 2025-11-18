let OnlineUsers = [];
let VideoCallUsers = [];

const TIMEOUT_SHORT = 750;
const TIMEOUT_MEDIUM = 1250;
const TIMEOUT_LONG = 1750;

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    
    socket.emit("user_details");
    
    socket.on("user_connected", (data) => {
      if (!OnlineUsers.includes(data._id)) {
        OnlineUsers.push(data._id);
      }
      setTimeout(() => {
        io.emit("onlineUsers", OnlineUsers);
      }, TIMEOUT_MEDIUM);
    });

    socket.on("get_video_users", () => {
      setTimeout(() => {
        socket.emit("videoCallUsers", VideoCallUsers);
      }, TIMEOUT_MEDIUM);
    });
    
    socket.on("Video_join", (data) => {
      const { selectedChat, user } = data;
    
      if (!VideoCallUsers.some(callUser => callUser.user._id === user._id)) {
        VideoCallUsers.push(data);
      }
    
      if (!selectedChat || !selectedChat.users) {
        return console.error(`[${new Date().toISOString()}] ERROR: selectedChat or users not defined`);
      }
    
      selectedChat.users.forEach((chatUser) => {
        if (chatUser._id !== user._id) {
          setTimeout(() => {
            io.to(chatUser._id).emit("video_user_joined", VideoCallUsers);
          }, TIMEOUT_MEDIUM);
          setTimeout(() => {
            io.to(chatUser._id).emit("video_user_joined", VideoCallUsers);
          }, TIMEOUT_LONG);
        }
      });
    });
    
    socket.on("Video_leave", (data) => {
      const { selectedChat, user } = data;
    
      VideoCallUsers = VideoCallUsers.filter(callUser => callUser.user._id !== user._id);
    
      if (!selectedChat || !selectedChat.users) {
        return console.error(`[${new Date().toISOString()}] ERROR: selectedChat or users not defined`);
      }
    
      selectedChat.users.forEach((chatUser) => {
        setTimeout(() => {
          io.to(chatUser._id).emit("video_user_left", VideoCallUsers);
        }, TIMEOUT_MEDIUM);
        setTimeout(() => {
          io.to(chatUser._id).emit("video_user_left", VideoCallUsers);
        }, TIMEOUT_LONG);
      });
    });
    
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });

    socket.on("new message", (newMessageReceived) => {
      const chat = newMessageReceived.chat;
      if (!chat.users) {
        return console.error(`[${new Date().toISOString()}] ERROR: chat.users not defined`);
      }
      
      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });
    
    socket.on("userDisconnected", (userData) => {
      OnlineUsers = OnlineUsers.filter(user => user !== userData._id);
      setTimeout(() => {
        io.emit("onlineUsers", OnlineUsers);
      }, TIMEOUT_MEDIUM);
    });

    socket.on("userReconnected", (userData) => {
      if (!OnlineUsers.includes(userData._id)) {
        OnlineUsers.push(userData._id);
      }
      setTimeout(() => {
        io.emit("onlineUsers", OnlineUsers);
      }, TIMEOUT_MEDIUM);
    });
    
    socket.on("disconnect", () => {
      setTimeout(() => {
        io.emit("onlineUsers", OnlineUsers);
      }, TIMEOUT_SHORT);
    });
  });
};
