const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require("./database/User");
const bcrypt = require('bcrypt');

const app = express();

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb+srv://fearlocity:fear@card.fzquwhr.mongodb.net/card_info?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Create a Mongoose model for your data
const UserInfo = mongoose.model('UserInfo', {
  backgroundColor: String,
  fontFamily: String,
  name: String,
  position: String,
  number: String,
  email: String,
  website: String,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/save-data', (req, res) => {
  const data = req.body;

  if (data) {
    // Create a new UserInfo document
    const userInfo = new UserInfo(data);

    // Save it to the MongoDB database
    userInfo
      .save()
      .then(() => {
        console.log('Data saved successfully');
        res.status(200).json({ message: 'Data saved successfully.' });
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Failed to save data.' });
      });
  } else {
    res.status(400).json({ message: 'Invalid data sent.' });
  }
});


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // res.status(201).json({ message: "Registration successful." });
    res.status(201).sendFile(path.join(__dirname, '/public/index.html'))
  } catch (error) {
    console.error("Registration error:", error);
    // res.status(500).json({ message: "Registration failed." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

     // res.status(200).json({ message: "Login successful." });
     res.status(200).sendFile(path.join(__dirname, '/public/app.html'));
  } catch (error) {
    console.error("Login error:", error);
    // res.status(500).json({ message: "Login failed." });
  }
});

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});