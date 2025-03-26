
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const database = client.db('bloodDonationApp');
    const usersCollection = database.collection('users');
    const requestsCollection = database.collection('bloodRequests');
    const donationsCollection = database.collection('donations');

    // Get all users
    app.get('/api/users', async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.json(users);
    });

    // Get a single user by id
    app.get('/api/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.json(user);
    });

    // Create a new user
    app.post('/api/users', async (req, res) => {
      const newUser = req.body;
      newUser.totalDonations = 0;
      newUser.isActive = true;
      const result = await usersCollection.insertOne(newUser);
      const user = await usersCollection.findOne({ _id: result.insertedId });
      res.json(user);
    });

    // Update a user
    app.put('/api/users/:id', async (req, res) => {
      const id = req.params.id;
      const userData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: userData };
      const result = await usersCollection.updateOne(filter, updateDoc);
      const updatedUser = await usersCollection.findOne(filter);
      res.json(updatedUser);
    });

    // Get all blood requests
    app.get('/api/bloodRequests', async (req, res) => {
      const requests = await requestsCollection.find({}).toArray();
      res.json(requests);
    });

    // Create a new blood request
    app.post('/api/bloodRequests', async (req, res) => {
      const newRequest = req.body;
      newRequest.postedAt = new Date().toISOString();
      newRequest.status = 'open';
      const result = await requestsCollection.insertOne(newRequest);
      const request = await requestsCollection.findOne({ _id: result.insertedId });
      res.json(request);
    });

    // Update a blood request
    app.put('/api/bloodRequests/:id', async (req, res) => {
      const id = req.params.id;
      const requestData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: requestData };
      const result = await requestsCollection.updateOne(filter, updateDoc);
      const updatedRequest = await requestsCollection.findOne(filter);
      res.json(updatedRequest);
    });

    // Get all donations
    app.get('/api/donations', async (req, res) => {
      const donations = await donationsCollection.find({}).toArray();
      res.json(donations);
    });

    // Get donations by user ID
    app.get('/api/donations/user/:userId', async (req, res) => {
      const userId = req.params.userId;
      const query = { donorId: userId };
      const donations = await donationsCollection.find(query).toArray();
      res.json(donations);
    });

    // Create a new donation
    app.post('/api/donations', async (req, res) => {
      const { donorId, requestId } = req.body;
      
      // Create donation record
      const newDonation = {
        donorId,
        requestId,
        donationDate: new Date().toISOString()
      };
      
      const result = await donationsCollection.insertOne(newDonation);
      
      // Update user's donation count
      await usersCollection.updateOne(
        { _id: new ObjectId(donorId) },
        { 
          $inc: { totalDonations: 1 },
          $set: { lastDonation: newDonation.donationDate }
        }
      );
      
      // Update request status
      await requestsCollection.updateOne(
        { _id: new ObjectId(requestId) },
        { $set: { status: 'fulfilled' } }
      );
      
      const donation = await donationsCollection.findOne({ _id: result.insertedId });
      res.json(donation);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
