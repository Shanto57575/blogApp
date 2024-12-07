import { useState, useEffect } from "react";
import {
	FaSearch,
	FaChevronLeft,
	FaChevronRight,
	FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function App() {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 0,
		totalBlogs: 0,
	});

	const categories = [
		{ value: "", label: "All", gradient: "from-gray-400 to-gray-600" },
		{
			value: "technology",
			label: "Technology",
			gradient: "from-blue-400 to-blue-600",
		},
		{
			value: "lifestyle",
			label: "Lifestyle",
			gradient: "from-green-400 to-green-600",
		},
		{ value: "food", label: "Food", gradient: "from-red-400 to-red-600" },
	];
	console.log(import.meta.env.VITE_BACKEND_URL);

	const fetchResults = async (page = 1) => {
		setLoading(true);
		try {
			const response = await axios.get(
				"https://shanto-blogbackend.vercel.app/api/search",
				{
					params: {
						query,
						category,
						page,
						limit: 6,
					},
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			setResults(response.data.blogs);
			setPagination({
				currentPage: response.data.currentPage,
				totalPages: response.data.totalPages,
				totalBlogs: response.data.totalBlogs,
			});
		} catch (error) {
			console.error("Search Error:", error);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchResults();
	}, [query, category]);

	const handlePageChange = (newPage) => {
		fetchResults(newPage);
	};

	return (
		<div className="min-h-screen text-justify font-serif antialiased bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
			<div className="container mx-auto px-4 py-8 md:px-8 lg:px-16">
				{/* Cosmic Header */}
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-12"
				>
					<h1
						className="text-5xl md:text-6xl font-extrabold mb-4 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-400 via-purple-500 to-red-500"
					>
						Blog Universe
					</h1>
					<p className="text-gray-400 max-w-2xl mx-auto text-lg">
						Discover endless tech innovations, delicious food ideas, and
						inspiring lifestyle tips
					</p>
				</motion.div>

				{/* Search and Filter Section */}
				<div className="max-w-4xl mx-auto mb-12">
					<div className="relative mb-6">
						<input
							type="text"
							placeholder="Explore topics, stories, insights..."
							className="w-full px-6 py-4 
                bg-gray-800 border-2 border-gray-700 rounded-full text-gray-200 placeholder-gray-500 
                focus:outline-none 
                focus:ring-2 focus:ring-purple-500 
                transition duration-300"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<FaSearch className="absolute right-6 top-5 text-gray-400" />
					</div>

					{/* Category Filters */}
					<div className="flex flex-wrap justify-center gap-3 mb-6">
						{categories.map((cat) => (
							<button
								key={cat.value}
								className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
									category === cat.value
										? `bg-gradient-to-r ${cat.gradient} text-white`
										: "bg-gray-800 text-gray-400 hover:bg-gray-700"
								}`}
								onClick={() => setCategory(cat.value)}
							>
								{cat.label}
							</button>
						))}
					</div>
				</div>

				{/* Results Section */}
				<div className="max-w-6xl mx-auto">
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<FaSpinner className="animate-spin text-4xl text-purple-500" />
						</div>
					) : results.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="bg-gray-900 rounded-2xl p-12 text-center"
						>
							<p className="text-gray-300 text-xl">
								Adjust your search for better results
							</p>
						</motion.div>
					) : (
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
							>
								{results.map((blog) => (
									<motion.div
										key={blog._id}
										initial={{ scale: 0.9, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500"
									>
										<div className="p-6 flex flex-col h-full">
											<h3 className="text-xl font-bold text-white mb-3">
												{blog.title}
											</h3>
											<p className="text-gray-400 mb-4 flex-grow">
												{blog.content.substring(0, 120)}...
											</p>
											<div className="flex justify-between items-center mt-auto">
												<a
													href="#"
													className="text-purple-400 hover:text-purple-300 transition duration-300 font-semibold"
												>
													Explore More
												</a>
												<div className="px-3 py-1 bg-opacity-20 rounded-full text-sm capitalize bg-gradient-to-r from-gray-600 to-gray-800 text-gray-300">
													{blog.category}
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
						</AnimatePresence>
					)}

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="flex justify-center items-center mt-12 space-x-4">
							<button
								onClick={() => handlePageChange(pagination.currentPage - 1)}
								disabled={pagination.currentPage === 1}
								className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full disabled:opacity-50 hover:bg-purple-600 transition duration-300"
							>
								<FaChevronLeft />
							</button>
							{[...Array(pagination.totalPages)].map((_, index) => (
								<button
									key={index}
									onClick={() => handlePageChange(index + 1)}
									className={`w-10 h-10 rounded-full ${
										pagination.currentPage === index + 1
											? "bg-gradient-to-r from-purple-500 to-red-500 text-white"
											: "bg-gray-800 text-gray-400 hover:bg-gray-700"
									}`}
								>
									{index + 1}
								</button>
							))}

							<button
								onClick={() => handlePageChange(pagination.currentPage + 1)}
								disabled={pagination.currentPage === pagination.totalPages}
								className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full disabled:opacity-50 hover:bg-purple-600 transition duration-300"
							>
								<FaChevronRight />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
