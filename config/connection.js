const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose.connect('mongodb+srv://robinshaji888:8gzieIutPiNVwomJ@cluster0.oripmdq.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};

module.exports = connectDB;