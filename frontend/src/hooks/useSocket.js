import { useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { config as appConfig } from "@/constants/config";
import { useAuthStore } from "@/stores";

let globalSocket = null;
const globalListeners = new Map();
let coreListenersSetup = false;

export const useSocket = () => {
  const user = useAuthStore((state) => state.user);
  const componentListenersRef = useRef(new Set());

  useEffect(() => {
    if (!globalSocket && user) {
      const ENDPOINT = appConfig.SOCKET_URL;
      globalSocket = io(ENDPOINT, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      if (!coreListenersSetup) {
        globalSocket.on("connect", () => {
          if (user) {
            globalSocket.emit("setup", user);
          }
        });

        globalSocket.on("connected", () => {
          console.log("Socket connected");
        });

        globalSocket.on("disconnect", () => {
          console.log("Socket disconnected");
        });

        coreListenersSetup = true;
      }
    }

    if (globalSocket && user && globalSocket.connected) {
      globalSocket.emit("setup", user);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      componentListenersRef.current.forEach((event) => {
        const handler = globalListeners.get(event);
        if (handler && globalSocket) {
          globalSocket.off(event, handler);
          globalListeners.delete(event);
        }
      });
      componentListenersRef.current.clear();
    };
  }, []);

  const on = useCallback((event, handler) => {
    if (!globalSocket) return;

    const previousHandler = globalListeners.get(event);
    if (previousHandler) {
      globalSocket.off(event, previousHandler);
    }

    globalSocket.on(event, handler);
    globalListeners.set(event, handler);
    componentListenersRef.current.add(event);
  }, []);

  const off = useCallback((event) => {
    if (!globalSocket) return;

    const handler = globalListeners.get(event);
    if (handler) {
      globalSocket.off(event, handler);
      globalListeners.delete(event);
      componentListenersRef.current.delete(event);
    }
  }, []);

  const emit = useCallback((event, data) => {
    if (globalSocket && globalSocket.connected) {
      globalSocket.emit(event, data);
    } else {
      console.warn(`Socket not connected. Cannot emit: ${event}`);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (globalSocket) {
      globalSocket.disconnect();
      globalSocket = null;
      globalListeners.clear();
    }
  }, []);

  const emitSetup = useCallback(() => {
    if (user && globalSocket && globalSocket.connected) {
      globalSocket.emit("setup", user);
    }
  }, [user]);

  const emitJoinChat = useCallback((chatId) => {
    if (globalSocket && globalSocket.connected && chatId) {
      globalSocket.emit("join chat", chatId);
    }
  }, []);

  const emitNewMessage = useCallback((message) => {
    if (globalSocket && globalSocket.connected && message) {
      globalSocket.emit("new message", message);
    }
  }, []);

  const emitUserDisconnected = useCallback(() => {
    if (user && globalSocket && globalSocket.connected) {
      globalSocket.emit("userDisconnected", user);
    }
  }, [user]);

  const emitUserReconnected = useCallback(() => {
    if (user && globalSocket && globalSocket.connected) {
      globalSocket.emit("userReconnected", user);
    }
  }, [user]);

  const reconnect = useCallback(() => {
    if (globalSocket && !globalSocket.connected) {
      globalSocket.connect();
    }
  }, []);

  const isConnected = globalSocket?.connected ?? false;

  return {
    socket: globalSocket,
    on,
    off,
    emit,
    isConnected,
    disconnect,
    reconnect,
    emitSetup,
    emitJoinChat,
    emitNewMessage,
    emitUserDisconnected,
    emitUserReconnected,
  };
};
