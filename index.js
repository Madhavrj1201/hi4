const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/campus-bridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/campus-bridge' }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Socket.IO for Code Rooms
io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('codeChange', (data) => {
    socket.to(data.roomId).emit('codeUpdate', data.code);
  });

  socket.on('chatMessage', (data) => {
    io.to(data.roomId).emit('message', {
      user: data.user,
      message: data.message,
      timestamp: new Date()
    });
  });
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/student', require('./routes/student'));
app.use('/faculty', require('./routes/faculty'));
app.use('/admin', require('./routes/admin'));
app.use('/ai', require('./routes/ai'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});