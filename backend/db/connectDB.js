const mongoose = require('mongoose');
require('dotenv').config()

const dbConnection = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MongoDB URI is not set in environment variables");
        }

        await mongoose.connect(mongoURI);

        console.log("MONGODB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = dbConnection;
