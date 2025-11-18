import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/Chatprovider';
import io from 'socket.io-client';
import { config as appConfig } from '../constants/config';

function VideoCall() {
  const { id } = useParams();
  const callContainerRef = useRef(null);
  const navigate = useNavigate();
  const { selectedChat, user, setEnableAnimation, videocall, setVideocall, isOneOnOneCall } = ChatState();
  const zpRef = useRef(null);
  var socket;

  useEffect(() => {
    const ENDPOINT = appConfig.SOCKET_URL;
    socket = io(ENDPOINT);

    if (videocall) {
      if (user && !zpRef.current) {
        const appID = appConfig.ZEGO_APP_ID;
        const serverSecret = appConfig.ZEGO_SERVER_SECRET;
        const roomID = id;
        const userID = user.name || `User_${new Date().getTime()}`;
        const userName = user.name || "user";

        try {
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

          // Create ZegoUIKitPrebuilt instance and assign it to zpRef
          const zp = ZegoUIKitPrebuilt.create(kitToken);
          zpRef.current = zp;

          if (zpRef.current) {
            zpRef.current.joinRoom({
              container: callContainerRef.current,
              scenario: {
                mode: isOneOnOneCall ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall,
              },
              onJoinRoom: () => {
                socket.emit('Video_join', { selectedChat, user});
                setTimeout(()=>{
                  socket.emit('Video_join', { selectedChat, user});
                },500)
              },
              onLeaveRoom: () => {
                zpRef.current.destroy();
                zpRef.current = null;
                setVideocall(false);
                socket.emit('Video_leave', { selectedChat, user});
                setTimeout(()=>{
                  socket.emit('Video_leave', { selectedChat, user});
                },500)
                setEnableAnimation(false);
                navigate('/chats', { state: { selectedChat } });
              },
              // Event when a user joins the room
            });
          } else {
            console.error('Zego instance could not be created');
          }
        } catch (error) {
          console.error('Error generating kit token or creating Zego instance:', error);
        }
      }

      // Clean-up function to leave the room if the component unmounts
      return () => {
        if (zpRef.current) {
          zpRef.current.destroy();
          zpRef.current = null; // Reset ref after leaving room
        }
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    } else {
      setEnableAnimation(false);
      navigate('/chats', { state: { selectedChat } });
    }
  }, [id, navigate, selectedChat, user, setEnableAnimation, videocall, isOneOnOneCall]);


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <div ref={callContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default VideoCall;

