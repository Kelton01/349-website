const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require("./database/User");
const bcrypt = require('bcrypt');
const favicon = require('express-favicon');

const app = express();

app.use(favicon(path.join(__dirname,'views','favicon.ico')));

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

app.set('view engine', 'ejs');


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

var user;
var savedUserName;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  savedUserName = username

  try {
    user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

     // res.status(200).json({ message: "Login successful." });
     //res.status(200).sendFile(path.join(__dirname, '/public/app.html'));
     res.status(200).render('app.ejs', {
      userName: user
     });
  } catch (error) {
    console.error("Login error:", error);
    // res.status(500).json({ message: "Login failed." });
  }
});

app.post('/save-data', async (req, res) => {
  const data = req.body;
  if (!user) {
    return res.status(401).json({ message: "User not found." });
  }

  // Update the user's data
  user.backgroundColor = data.backgroundColor;
  user.font = data.font;
  user.name = data.name;
  user.position = data.position;
  user.phone = data.phone;
  user.email = data.email;
  user.website = data.website;

  try {
    const updatedUser = await user.save();
    console.log('Data updated successfully');
    res.status(200).json({ message: 'Data updated successfully.' });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ message: 'Failed to update data.' });
  }
});

app.get("/load-data", async (req, res) => {
  try {
    const lastSavedData = user

    if (!lastSavedData) {
      return res.status(404).json({ message: "No data found in the database." });
    }

    res.status(200).json(lastSavedData);
  } catch (error) {
    console.error("Error loading last saved data:", error);
    res.status(500).json({ message: "Failed to load last saved data." });
  }
});

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});