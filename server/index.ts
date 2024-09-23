import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http'; // Required for Socket.IO
// import { Server } from 'socket.io'; // Importing Socket.IO
// import userRoutes from './routes/userRoutes';
// import problemRoutes from './routes/problemRoutes';

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         credentials: true,
//         methods: ['GET', 'POST'],
//     },
// });

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
// app.use('/user', userRoutes);
// app.use('/problem', problemRoutes);
app.get('/hello', (req, res) => {
    res.send('Hello World!'); 
});

type Room = {
    users: Map<string, string>;
};

// Temporary in-memory store for rooms and their passwords
// const rooms: { [key: string]: { password: string; users: string[] } } = {};
const rooms = new Map<string, Room>();

// io.on('connection', (socket) => {
//     // console.log('A user connected', socket.id);
//     console.log('Socket connected');

//     // Room creation
//     socket.on('createRoom', ({ roomId, username }, callback) => {
//         console.log('Creating room: ', roomId);

//         // roomId = roomId;

//         if (rooms.has(roomId)) {
//             callback({ success: false, message: 'Room already exists' });
//             return;
//         }

//         socket.join(roomId);

//         rooms.set(roomId, {
//             users: new Map([[roomId, username]]),
//         });

//         const room = rooms.get(roomId);
//         console.log(room);
        
//         // display the members of the room
//         console.log("Members of the room: ", room?.users);

//         callback({ success: true, roomId });
//         io.to(roomId).emit('roomCreated', { roomId, username });
//     });

//     // Room checking
//     socket.on('checkRoom', ({ roomId }, callback) => {
//         console.log("checkRoom called")
//         console.log('Checking room: ', roomId);
//         const room = rooms.get(roomId);
//         if (room) {
//             console.log("Room exists: ", roomId);
//             callback({ success: true, roomId });
//         } else {
//             callback({ success: false, message: 'Room does not exist' });
//         }
//     });

//     // socket.on("check_room", (roomId) => {
//     //     if (rooms.has(roomId)) socket.emit("room_exists", true);
//     //     else socket.emit("room_exists", false);
//     //   });

//     // Room joining
//     socket.on('joinRoom', ({ roomId, username }, callback) => {
//         console.log("joinRoom called")
//         console.log(rooms)
//         console.log('Joining room: ', roomId, " User: ", username);
//         // socket.join(roomId);

//         // if (!rooms.has(roomId)) {
//         //     callback({ success: false, message: 'Room does not exist' });
//         //     return;
//         // } else {
//         //     rooms.get(roomId)?.users.set(username, socket.id);
//         //     console.log("Members of the room: ", rooms.get(roomId)?.users);
//         //     callback({ success: true, roomId });

//         //     io.to(roomId).emit('userJoined', { roomId, username });
//         // }
//     });




    

//     // Room leaving
//     // socket.on('leaveRoom', (roomId, callback) => {
//     //     const room = rooms[roomId];
//     //     if (room) {
//     //         socket.leave(roomId);
//     //         room.users = room.users.filter((user) => user !== socket.id);
//     //         if (room.users.length === 0) {
//     //             delete rooms[roomId]; // Delete room if no users are left
//     //             console.log(`Room ${roomId} deleted`);
//     //         }
//     //         callback({ success: true });
//     //     } else {
//     //         callback({ success: false, message: 'Room does not exist' });
//     //     }
//     // });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log(`User ${socket.id} disconnected`);
//     });
// });

// const port = Number(process.env.PORT) || 3001;
// server.listen(port, '0.0.0.0', () => {
//     console.log(`Server running on port ${port}`);
// });
