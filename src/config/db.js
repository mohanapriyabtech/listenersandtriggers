const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/school_management";
mongoose.set("strictQuery", true);

export const connectDB = async () => {
  try {
    const mongoose = require('mongoose');

    // Connect to MongoDB
    mongoose.connect('mongodb://localhost:27017/chat-app', { useNewUrlParser: true })
    // Listen for the 'open' event
    mongoose.connection.on('open', () => {
      console.log('Connected to MongoDB');
    });
    mongoose.connection.on('close', () => {
      console.log('MongoDB connection closed');
    });
        // Set up a change stream on the collection
  //   const changeStream = School.watch()
  //   // on('change', data => console.log(data));
  
  //  //console.log(changeStream,"change stream")

  //   // // Start listening for changes
  //   changeStream.on('change', (change) => {
  //     console.log('Change:', change);
  //   });
          
  } catch (err) {
    console.log(err);
  }
};


exports.handler = async (event, context) => {
  // Access the changed documents from the event object
  const changedDocuments = event.Records.map(record => record.fullDocument);

  // Handle changes
  console.log('Handling changes in the MongoDB collection...', changedDocuments);
};




