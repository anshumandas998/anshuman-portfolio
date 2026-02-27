require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:");
  console.error(err.message);
});

const Contact = require('./models/Contact');

// Contact API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(process.env.PORT || 5001, () => {
  console.log("🚀 Server running on port 5001");
});