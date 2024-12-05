const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Blog = require("./models/blog.model");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB CONNECTED");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.send({ message: "Blog Api is Running Fine" })
})

app.get("/api/search", async (req, res) => {
    const {
        query = '',
        category = '',
        page = 1,
        limit = 6
    } = req.query;

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let searchQuery = {};

    // More flexible search with case-insensitive partial matching
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
        // Total count for pagination
        const totalBlogs = await Blog.countDocuments(searchQuery);

        // Paginated results
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

app.listen(PORT, () => {
    startServer();
    console.log(`Server is running on port ${PORT}`);
});
