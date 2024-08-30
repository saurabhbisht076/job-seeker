// server.js
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userData.models');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://saurabh482:98VszhdmdendDQEo@cluster0.lb2yd.mongodb.net/saurabh?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get('/', async (req, res) => { 
  try { 
    res.send("hello"); 
  } catch (error) { 
    res.status(500).send({ error: error.message }); 
  } 
});
