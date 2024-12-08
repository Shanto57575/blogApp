const express = require("express");
const cors = require("cors");
const Blog = require("./models/blog.model");
const dbConnection = require("./db/connectDB");
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database');
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'https://your-frontend-url.vercel.app',
        'http://localhost:5173'
    ];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send({ message: "Blog API is Running Fine" });
});

app.get("/api/search", async (req, res) => {
    const {
        query = '',
        category = '',
        page = 1,
        limit = 6
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let searchQuery = {};

    if (query && query.trim()) {
        searchQuery.$or = [
            { title: { $regex: query.trim(), $options: "i" } },
            { content: { $regex: query.trim(), $options: "i" } }
        ];
    }

    if (category && category.trim()) {
        searchQuery.category = { $regex: category.trim(), $options: "i" };
    }

    try {
        // Add connection check
        if (mongoose.connection.readyState !== 1) {
            await dbConnection();
        }

        const totalBlogs = await Blog.countDocuments(searchQuery);

        const blogs = await Blog.find(searchQuery)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        res.json({
            blogs,
            totalBlogs,
            currentPage: pageNum,
            totalPages: Math.ceil(totalBlogs / limitNum)
        });
    } catch (error) {
        console.error("Detailed Search Error:", error);
        res.status(500).json({
            message: "Error searching blogs",
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).send('Something broke!');
});

const startServer = async () => {
    try {
        // Establish DB connection first
        await dbConnection();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
};

startServer();