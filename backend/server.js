const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Blog = require("./models/blog.model");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: [
        'https://blog-uni-verse.vercel.app',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const startServer = async () => {
    try {
        console.log("MongoDB URL:", process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MONGODB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.error("Error connecting to MongoDB:", {
            message: error.message,
            stack: error.stack
        });
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

app.listen(PORT, async () => {
    await startServer();
    console.log(`Server is running on port ${PORT}`);
});
