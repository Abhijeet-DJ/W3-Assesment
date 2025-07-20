import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // change to your backend server

export default socket;
