const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Middlewares
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
