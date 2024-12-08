const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        console.log("Attempting to connect to MongoDB with URI:", mongoURI);

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
        });

        console.log("MONGODB CONNECTED SUCCESSFULLY");

    } catch (error) {
        console.error("Detailed MongoDB Connection Error:", error);
        throw error;
    }
};

module.exports = dbConnection;