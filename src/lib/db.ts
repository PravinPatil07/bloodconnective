
import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection string - replace with your actual connection string
// In production, this should be stored in environment variables
const uri = "mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collections
export const collections = {
  users: 'users',
  requests: 'bloodRequests',
  donations: 'donations'
};

export const connectToDatabase = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db('bloodDonationApp');
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

export const closeDatabaseConnection = async () => {
  try {
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error disconnecting from MongoDB:", err);
  }
};

export const getDb = async () => {
  try {
    await client.db("admin").command({ ping: 1 });
    return client.db('bloodDonationApp');
  } catch (err) {
    console.log("MongoDB not connected, attempting to connect...");
    return connectToDatabase();
  }
};

