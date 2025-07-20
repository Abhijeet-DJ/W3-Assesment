const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const UserPoint = require('./models/user');

// === MongoDB Connection ===
mongoose.connect(
  "mongodb+srv://ionode:ionode@ionode.qgqbadm.mongodb.net/Assesment?retryWrites=true&w=majority&appName=ionode",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// === App and Middleware ===
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json()); // for parsing JSON in POST requests

// === Socket.IO Setup ===
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// === Routes ===
app.post('/webhook/points', async (req, res) => {
  const { userId, newPoints } = req.body;

  if (!userId || newPoints == null) {
    return res.status(400).json({ message: 'Missing userId or newPoints' });
  }

  try {
    const updated = await UserPoint.findOneAndUpdate(
      { userId },
      { points: newPoints },
      { new: true, upsert: true }
    );

    io.emit('pointsUpdated', { userId, newPoints: updated.points });

    console.log(`🔁 Points updated for ${userId}: ${updated.points}`);
    res.status(200).json({ message: 'Points updated and broadcasted' });
  } catch (err) {
    console.error('❌ Error updating points:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Socket Events ===
// server.js or socketHandlers.js

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("getUser", async () => {
  const users = await UserPoint.find(); // Replace with your DB logic
  const sanitized = users.map(user => ({
  id: user._id.toString(),
  name: user.name,
  avatar: user.avatar,
  points: user.points
}));

  socket.emit("userList", sanitized);
});

  socket.on("addUser", async (userData) => {
  try {
    console.log(userData);

    const newUser = new UserPoint({
      userId: userData.id, // <-- map frontend's `id` to `userId`
      name: userData.name,
      avatar: userData.avatar,
      points: userData.points ?? 0,
    });

    await newUser.save();

    io.emit("userAdded", {
      id: newUser._id.toString(),
      name: newUser.name,
      avatar: newUser.avatar,
      points: newUser.points || 0,
    });
  } catch (error) {
    console.error("Failed to add user:", error);
  }
});


  socket.on("claimPoints", async ({ userId, points }) => {
    try {
      // console.log(userId);
      
      const user = await UserPoint.findOne({userId});
      if (!user) return;

      user.points += points;
      await user.save();

      io.emit("pointsUpdated", {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        points: this.points+user.points,
      });
    } catch (error) {
      console.error("Error claiming points:", error);
    }
  });
});


// === Server Start ===
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
