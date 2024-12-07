const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        console.log("MongoDB URL:", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.error("Error connecting to MongoDB:", {
            message: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
};

module.exports = dbConnection;
