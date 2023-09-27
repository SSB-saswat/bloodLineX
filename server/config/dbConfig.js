const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

// verify connection
connection.on("connected", () => {
  console.log("MongoDB connection successful");
});

// verify connection error
connection.on("error", (err) => {
  console.log("MongoDB Connection Error", err);
});
