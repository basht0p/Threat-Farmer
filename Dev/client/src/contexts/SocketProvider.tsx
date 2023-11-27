import React, { createContext, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import config from "../../../config/config";

const SocketContext = createContext<Socket | null>(null);

type SocketProviderProps = {
  children: ReactNode;
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  console.log("Connection from socket provider started...");
  const socket = io(`wss://${config.domainName}/ws`);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
