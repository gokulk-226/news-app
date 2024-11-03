const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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

// Topic schema and model
const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Topic = mongoose.model('Topic', topicSchema);

// User preference schema and model
const userPreferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  articleId: { type: String, required: true },
  liked: { type: Boolean, default: false }
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

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

// Store searched topic endpoint
app.post('/store-topic', async (req, res) => {
  const { topic } = req.body;

  try {
    const newTopic = new Topic({ topic });
    await newTopic.save();
    res.status(201).json({ message: 'Topic stored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error storing topic', error });
  }
});

// Store user preference endpoint
app.post('/store-preference', async (req, res) => {
  const { userId, articleId, liked } = req.body;

  try {
    const existingPreference = await UserPreference.findOne({ userId, articleId });
    if (existingPreference) {
      existingPreference.liked = liked;
      await existingPreference.save();
    } else {
      const newPreference = new UserPreference({ userId, articleId, liked });
      await newPreference.save();
    }

    res.status(201).json({ message: 'Preference stored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error storing preference', error });
  }
});

// Fetch and preprocess articles for KNN
const fetchAndPreprocessArticles = async () => {
  const articles = await Topic.find(); // Replace with actual articles data
  // Implement TF-IDF or any vectorization here
  return articles.map(article => ({
    // Example of converting article to a vector representation
    vector: [/* Vector representation of article */],
    id: article._id
  }));
};

// Get recommendations endpoint
app.post('/get-recommendations', async (req, res) => {
  const { userId } = req.body;

  try {
    const userPreferences = await UserPreference.find({ userId });
    const articles = await fetchAndPreprocessArticles();

    // Extract vectors and labels
    const vectors = articles.map(article => article.vector);
    const labels = articles.map(article => article.id);

    // Initialize and train KNN
    const knn = new KNN(vectors, labels, { k: 3 }); // Adjust k based on your needs

    const recommendedIds = knn.predict(userPreferences.map(pref => {
      // Prepare user preference vector here
      return [/* Vector representation of user preference */];
    }));

    const recommendedArticles = await Topic.find({ _id: { $in: recommendedIds } });
    res.status(200).json(recommendedArticles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
