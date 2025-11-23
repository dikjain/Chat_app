import { useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { config as appConfig } from "@/constants/config";
import { useAuthStore } from "@/stores";

let globalSocket = null;
const globalListeners = new Map();
let coreListenersSetup = false; // Track if core listeners are already set up

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

      // Setup core listeners only once
      if (!coreListenersSetup) {
        globalSocket.on("connect", () => {
          if (user) {
            globalSocket.emit("setup", user);
          }
        });

        // Handle connection status - only log once per connection
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

  const isConnected = globalSocket?.connected ?? false;

  return {
    socket: globalSocket,
    on,
    off,
    emit,
    isConnected,
    disconnect,
  };
};
