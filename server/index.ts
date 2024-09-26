import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
// import userRoutes from './routes/userRoutes';
// import problemRoutes from './routes/problemRoutes';

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST'],
    },
    // cors: {
    //     origin: '*', // Allow cross-origin requests (you can restrict this based on your client domain)
    // },
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
// app.use('/user', userRoutes);
// app.use('/problem', problemRoutes);
// app.get('/', (req, res) => {
//     res.send('Socket.IO server is running');
// });
// app.get('/hello', (req, res) => {
//     res.send('Hello World!'); 
// });

type Room = {
    users: string[] | null;
    selectedProblem: Problem | null;
    host: string;
};

type Problem = {
    problemId: string;
    idTitle: string;
    title: string;
    difficulty: string;
    order: number;
    createdAt: string;
    updatedAt: string;
};

// Temporary in-memory store for rooms and their passwords
// const rooms: { [key: string]: { password: string; users: string[] } } = {};
const rooms = new Map<string, Room>();

io.on('connection', (socket) => {
    // console.log('A user connected', socket.id);
    console.log('Socket connected');
    // display the rooms
    console.log("Rooms: ", rooms);

    // Room creation
    socket.on('createRoom', ({ roomId, username, selectedProblem }, callback) => {
        console.log('createRoom - Creating room: ', roomId);
        console.log('createRoom - User: ', username);
        console.log('createRoom - Selected problem: ', selectedProblem);
        // roomId = roomId;

        if (rooms.has(roomId)) {
            // callback({ success: false, message: 'Room already exists' });
            console.log('createRoom - Room already exists: ', roomId);
            return;
        }

        socket.join(roomId);

        rooms.set(roomId, {
            users: [username],
            selectedProblem,
            host: username,
        });

        const room = rooms.get(roomId);
        console.log("createRoom - Room: ", room);
        
        // display the members of the room
        console.log("createRoom - Members of the room: ", room?.users);

        callback({ success: true, roomId });
        console.log("createRoom - Room created: ", roomId);
        // io.to(roomId).emit('roomCreated', { roomId, username });
    });

    // Room checking
    socket.on('checkRoom', ({ roomId }, callback) => {
        console.log("checkRoom called")
        console.log('Checking room: ', roomId);
        // display the rooms
        console.log("Room: ", rooms);
        const room = rooms.get(roomId);
        if (room) {
            console.log("Room exists: ", roomId);
            callback({ success: true });
        } else {
            callback({ success: false, message: 'Room does not exist' });
        }
    });

    // Room joining
    socket.on('joinRoom', ({ roomId, username }, callback) => {
        console.log("joinRoom called")
        console.log("joinRoom - Rooms: ", rooms)
        console.log('joinRoom - Joining room: ', roomId, " User: ", username);
        
        if (rooms.has(roomId)) {
            socket.join(roomId);
            const room = rooms.get(roomId);
            
            // append the user to the room
            room?.users?.push(username);
            console.log("joinRoom - Users in the room: ", room?.users);
            // callback({ success: true });
            console.log("joinRoom - User joined the room: ", roomId);
            

            callback({ success: true, selectedProblem: room?.selectedProblem?.idTitle, host: room?.host });
            // io.to(roomId).emit('userJoined', { roomId, username });
        } else {
            console.log("joinRoom - Room does not exist: ", roomId);
            // return callback({ success: false, message: 'Room does not exists' });
            // io.to(roomId).emit('roomDoesNotExist', { roomId, username });
        }
    });

    // Get host
    socket.on('getHost', ({ roomId }, callback) => {
        console.log("getHost called")
        console.log("getHost - Rooms: ", rooms)
        console.log('getHost - Getting host: ', roomId);
        const room = rooms.get(roomId);
        console.log("getHost - Host: ", room?.host);
        callback({ success: true, host: room?.host });
    });

    // Change problem
    socket.on('changeProblem', ({ roomId, problemId }, callback) => {
        console.log("changeProblem called")
        console.log("changeProblem - Rooms: ", rooms)
        console.log('changeProblem - Changing problem: ', problemId, " in room: ", roomId);
        // rooms.get(roomId)?.selectedProblem = problemId;
        console.log("changeProblem - Problem changed: ", problemId);
        callback({ success: true });
    });

    

    // Room leaving
    socket.on('leaveRoom', ({ roomId, username }, callback) => {
        console.log('leaveRoom - Leaving room: ', roomId, " User: ", username);
        socket.leave(roomId);

        const room = rooms.get(roomId);

        // find the user in the room and delete it
        console.log("leaveRoom - Before deleting: Users in the room: ", room?.users);
        console.log("leaveRoom - Socket ID: ", socket.id);
        if (room && room.users) {
            room.users = room.users.filter(user => user !== username);
        }
        console.log("leaveRoom - After deleting: Users in the room: ", room?.users);

        // callback({ success: true });
        // io.to(roomId).emit('userLeft', { roomId, username });
        console.log("leaveRoom - Members of the room: ", room?.users);
        if (room?.users?.length === 0) {
            rooms.delete(roomId);
            console.log("leaveRoom - Room deleted: ", roomId);
        }
        callback({ success: true });
        console.log("leaveRoom - User left the room: ", roomId);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

const port = Number(process.env.PORT) || 3001;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
