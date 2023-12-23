import { io } from "socket.io-client";

const BACKEND_URL = "http://192.168.50.85:8000";

export const socket = io(BACKEND_URL, {
    
});