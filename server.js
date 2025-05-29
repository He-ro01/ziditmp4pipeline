require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cacheRoutes = require('./routes/cache');

const app = express();

// ✅ Enable CORS for development (allows all origins)
app.use(cors());

// ✅ Optional: Restrict CORS in production
// app.use(cors({
//   origin: ['https://yourfrontend.com'],
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type']
// }));

// ✅ Middleware
app.use(express.json());
app.use(morgan('dev'));

// ✅ Routes
app.use('/api', cacheRoutes);

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
