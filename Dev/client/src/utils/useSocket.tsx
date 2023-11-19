import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

function useSocket(socket: Socket, listeners = []) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Registering custom listeners
    listeners.forEach(({ event, callback }) => {
      socket.on(event, callback);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      // Deregistering custom listeners
      listeners.forEach(({ event, callback }) => {
        socket.off(event, callback);
      });
    };
  }, [socket, listeners]);

  return { isConnected };
}

export default useSocket;
