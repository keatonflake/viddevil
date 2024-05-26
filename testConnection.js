require('dotenv').config();
const mongoose = require('mongoose');

// Check if the MONGO_URI is loaded correctly
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

connectDB();
