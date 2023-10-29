const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true
  },
  name: {
      type: String,
      default: 'Name Here'
  },
  position: {
      type: String,
      default: 'Position Here'
  },
  phone: {
      type: String,
      default: 'Phone: 123-456-7890'
  },
  email: {
      type: String,
      default: 'Email: name@example.com'
  },
  website: {
      type: String,
      default: 'www.example.com'
  },
  backgroundColor: {
      type: String,
      default: '#E8E8E8'
  },
  font: {
      type: String,
      default: 'Arial, sans-serif'
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;