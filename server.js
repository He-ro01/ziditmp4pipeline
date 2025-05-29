require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ Required for self-ping

const cacheRoutes = require('./routes/cache');

const app = express();

// ✅ Middleware
app.use(cors()); // Allow all origins (for development)
app.use(express.json());
app.use(morgan('dev'));

// ✅ Routes
app.use('/api', cacheRoutes);

// ✅ Root wake route (used for Render wake-up or status check)
app.get('/', (req, res) => {
  res.send('✅ Cache server is alive at ' + new Date().toISOString());
});

// ✅ MongoDB connection & server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(3000, () => {
      console.log('✅ Cache server running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// ✅ Optional: Self-ping every 4 minutes to keep server awake on Render free tier
if (process.env.SELF_URL) {
  setInterval(() => {
    fetch(`${process.env.SELF_URL}/`)
      .then(res => res.text())
      .then(data => console.log(`🔁 Self-ping success: ${data}`))
      .catch(err => console.error('❌ Self-ping failed:', err));
  }, 1000 * 60 * 4); // every 4 minutes
}
