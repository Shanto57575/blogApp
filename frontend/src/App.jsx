import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
	FaSearch,
	FaMagic,
	FaCode,
	FaHeart,
	FaGlobeAmericas,
	FaCanadianMapleLeaf,
} from "react-icons/fa";
import { GiLifeBar } from "react-icons/gi";

function App() {
	// State Management
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [darkMode, setDarkMode] = useState(true);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 0,
		totalBlogs: 0,
	});

	// Enhanced Categories
	const categories = [
		{
			value: "",
			label: "Explore All",
			icon: FaGlobeAmericas,
			gradient: "from-gray-500 to-gray-700",
		},
		{
			value: "technology",
			label: "Tech Horizons",
			icon: FaCode,
			gradient: "from-cyan-500 to-blue-600",
		},
		{
			value: "health",
			label: "Wellness Insights",
			icon: FaHeart,
			gradient: "from-green-500 to-emerald-600",
		},
		{
			value: "lifestyle",
			label: "Lifestyle",
			icon: GiLifeBar,
			gradient: "from-purple-500 to-indigo-600",
		},
		{
			value: "travel",
			label: "Travel",
			icon: FaCanadianMapleLeaf,
			gradient: "from-purple-500 to-indigo-600",
		},
	];

	// Fetch Blogs
	const fetchBlogs = useCallback(
		async (page = 1) => {
			setLoading(true);
			try {
				const response = await axios.get(
					`https://blogapp-qqer.onrender.com/api/search`,
					{
						params: {
							query,
							category,
							page,
							limit: 6,
						},
					}
				);

				setBlogs(response.data.blogs);
				setPagination({
					currentPage: response.data.currentPage,
					totalPages: response.data.totalPages,
					totalBlogs: response.data.totalBlogs,
				});
			} catch (error) {
				console.error("Fetch Error:", error);
				setBlogs([]);
			} finally {
				setLoading(false);
			}
		},
		[query, category]
	);

	// Pagination Handler
	const handlePageChange = (newPage) => {
		fetchBlogs(newPage);
	};

	// Effects
	useEffect(() => {
		fetchBlogs();
	}, [query, category, fetchBlogs]);

	// Unique Gradient Function
	const generateUniqueGradient = (index) => {
		const gradients = [
			"from-purple-600 via-indigo-500 to-blue-500",
			"from-pink-500 via-red-500 to-yellow-500",
			"from-green-400 via-emerald-500 to-teal-600",
			"from-orange-500 via-amber-600 to-yellow-500",
		];
		return gradients[index % gradients.length];
	};

	return (
		<div
			className={`min-h-screen transition-colors duration-300 font-serif antialiased ${
				darkMode
					? "bg-gradient-to-br from-[#121420] via-[#1e2235] to-[#0a0e1a] text-gray-100"
					: "bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-900"
			}
      `}
		>
			<div
				onClick={() => setDarkMode(!darkMode)}
				className={`
          fixed top-4 right-4 z-50 
          w-16 h-8 rounded-full cursor-pointer 
          transition-all duration-300 
          ${
						darkMode
							? "bg-gradient-to-r from-indigo-600 to-purple-600"
							: "bg-gradient-to-r from-yellow-400 to-orange-500"
					}
          flex items-center 
          ${darkMode ? "justify-end" : "justify-start"}
          p-1
        `}
			>
				<div
					className={`
            w-6 h-6 rounded-full 
            ${
							darkMode
								? "bg-[#121420] text-purple-300"
								: "bg-white text-yellow-500"
						}
            flex items-center justify-center
            shadow-lg transform transition-transform duration-300
          `}
				>
					{darkMode ? "🌙" : "☀️"}
				</div>
			</div>

			<div className="container mx-auto px-4 py-8 md:px-8 lg:px-16">
				{/* Dynamic Header */}
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12 space-y-4"
				>
					<h1
						className={`
              text-5xl md:text-6xl font-extrabold 
              bg-clip-text text-transparent 
              ${
								darkMode
									? "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
									: "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900"
							}
            `}
					>
						Blog Universe
					</h1>
					<p
						className={`
              max-w-2xl mx-auto text-lg 
              ${darkMode ? "text-gray-300" : "text-gray-700"}
            `}
					>
						Curate, Explore, Transform: Your Gateway to Boundless Knowledge
					</p>
				</motion.div>

				{/* Search Section */}
				<div className="max-w-4xl mx-auto mb-12">
					<div className="relative mb-6">
						<input
							type="text"
							placeholder="Dive into insights..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className={`
                w-full px-6 py-4 rounded-xl 
                ${
									darkMode
										? "bg-[#1e2235] border-[#2c3347] text-gray-200 placeholder-gray-500"
										: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
								}
                border-2 
                focus:outline-none 
                focus:ring-2 focus:ring-cyan-500 
                transition duration-300
              `}
						/>
						<FaSearch
							className={`
                absolute right-6 top-5 
                ${darkMode ? "text-gray-400" : "text-gray-600"}
              `}
						/>
					</div>

					{/* Category Filters */}
					<div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
						{categories.map((cat, index) => {
							const CategoryIcon = cat.icon;
							return (
								<button
									key={cat.value}
									onClick={() => setCategory(cat.value)}
									className={`
          px-3 sm:px-4 py-2 rounded-full 
          flex items-center space-x-2 
          transition duration-300 
          text-sm sm:text-base
          ${
						category === cat.value
							? `bg-gradient-to-r ${cat.gradient} text-white`
							: `
                ${
									darkMode
										? "bg-[#2c3347] text-gray-300 hover:bg-[#3a4255]"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}
              `
					}
        `}
								>
									<CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5" />
									<span className="hidden sm:inline">{cat.label}</span>
									{/* Short labels for mobile */}
									<span className="sm:hidden">{cat.label.split(" ")[0]}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Blog Results */}
				<div className="max-w-6xl mx-auto">
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<FaMagic className="animate-pulse text-4xl text-cyan-500" />
						</div>
					) : blogs?.length === 0 ? (
						<div
							className={`
                text-center p-12 rounded-xl ${
									darkMode
										? "bg-[#1e2235] text-gray-300"
										: "bg-white text-gray-700"
								}
              `}
						>
							<p>
								No blogs found. Adjust your search or explore different
								categories.
							</p>
						</div>
					) : (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{blogs?.map((blog, index) => (
								<motion.div
									key={blog._id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
									className={`
                    rounded-xl overflow-hidden 
                    transform transition duration-300 
                    hover:scale-105 hover:shadow-2xl
                    ${
											darkMode
												? "bg-[#1e2235] border border-[#2c3347]"
												: "bg-white shadow-md"
										}
                  `}
								>
									<div
										className={`
                      h-2 w-full 
                      bg-gradient-to-r 
                      ${generateUniqueGradient(index)}
                    `}
									/>
									<div className="p-6 flex flex-col h-full">
										<h3
											className={`
                        text-xl font-bold mb-3 
                        ${darkMode ? "text-gray-100" : "text-gray-900"}
                      `}
										>
											{blog.title}
										</h3>
										<p
											className={`
                        mb-4 flex-grow 
                        ${darkMode ? "text-gray-400" : "text-gray-600"}
                      `}
										>
											{blog.content.substring(0, 120)}...
										</p>
										<div className="flex justify-between items-center mt-auto">
											<span
												className={`
                          px-3 py-1 rounded-full text-sm 
                          ${
														darkMode
															? "bg-[#2c3347] text-cyan-300"
															: "bg-gray-200 text-gray-700"
													}
                        `}
											>
												{blog.category}
											</span>
											<a
												href="#"
												className={`
                          font-medium 
                          ${
														darkMode
															? "text-cyan-400 hover:text-cyan-300"
															: "text-blue-600 hover:text-blue-700"
													}
                        `}
											>
												Read More
											</a>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					)}

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="flex justify-center space-x-4 mt-12">
							{[...Array(pagination.totalPages)].map((_, index) => (
								<button
									key={index}
									onClick={() => handlePageChange(index + 1)}
									className={`
                    w-10 h-10 rounded-full 
                    transition duration-300
                    ${
											pagination.currentPage === index + 1
												? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
												: `
                        ${
													darkMode
														? "bg-[#2c3347] text-gray-400 hover:bg-[#3a4255]"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}
                      `
										}
                  `}
								>
									{index + 1}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
