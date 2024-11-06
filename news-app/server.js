const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => console.error('Error connecting to MongoDB:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Bookmark schema and model
const bookmarkSchema = new mongoose.Schema({
  article: {
    title: String,
    url: String,
    urlToImage: String,
    description: String,
    publishedAt: Date
  }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Add bookmark endpoint
app.post('/bookmarks', async (req, res) => {
  const { article } = req.body;

  try {
    const existingBookmark = await Bookmark.findOne({ 'article.url': article.url });
    if (existingBookmark) {
      return res.status(400).json({ message: 'Bookmark already exists' });
    }

    const newBookmark = new Bookmark({ article });
    await newBookmark.save();
    res.status(201).json({ message: 'Bookmark added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding bookmark', error });
  }
});

// Get all bookmarks
app.get('/bookmarks', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks', error });
  }
});

// Delete bookmark endpoint
app.delete('/bookmarks', async (req, res) => {
  const { url } = req.body;

  try {
    const result = await Bookmark.findOneAndDelete({ 'article.url': url });
    if (!result) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing bookmark', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
