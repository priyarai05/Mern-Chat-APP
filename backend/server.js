const express = require('express')
const dotenv = require('dotenv')
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express()
dotenv.config();
connectDB();

// app.get('/',(req,res) => {
//     res.send("API is running")
// })

app.use(express.json()) //accept json data
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require('./middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.post('/api/ai', protect, async (req, res) => {
  try {
    const { message } = req.body; 
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
    }); 
    const result = await model.generateContent(message); 
    const response = result.response.text(); 
    res.json({ reply: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} )
// --------------------------------------Deployment---------------------------------------------

const __dirname1 = path.resolve()

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1, 'frontend/build')))
    app.get(/^(?!\/api).*/,(req,res) => {
        res.sendFile(path.resolve(__dirname1, "frontend","build","index.html"))
    })
}else{
    app.get('/',(req,res) => {
        res.send("API is running")
    })
}

// --------------------------------------Deployment---------------------------------------------

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`.yellow.bold))

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
})

io.on("connection", (socket) => {
    console.log("connnect to socket.io");

    socket.on("setup",(userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on("join chat",(room) => {
        socket.join(room);
        console.log(room);
    })

    socket.on("typing",(room) => socket.in(room).emit("typing"));
    socket.on("stop typing",(room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("Chat.users not defined")

        chat.users.forEach((user) => {
            if(user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })

    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    })
})