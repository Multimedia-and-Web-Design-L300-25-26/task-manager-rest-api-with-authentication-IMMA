import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Use MongoDB URI from jest-mongodb, fallback to local
process.env.MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/task-manager-test";
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-secret-key";
}

// Connect to test database before all tests
beforeAll(async () => {
  try {
    // Disconnect any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect mongoose to the test database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Test database connected");
  } catch (error) {
    console.error("Test database connection failed:", error);
    throw error;
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("Test database disconnected");
  } catch (error) {
    console.error("Error closing test database:", error);
  }
});

// Clear all collections before each test
beforeEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error("Error clearing collections:", error);
  }
});