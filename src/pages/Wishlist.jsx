import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const mockWishlist = [
	{
		id: 1,
		name: 'Organic Heirloom Tomatoes',
		farmer: 'Green Valley Farm',
		price: 45,
		originalPrice: 55,
		unit: 'kg',
		image: 'https://images.unsplash.com/photo-1546470427-e9e3c9bbb413?w=500&h=300&fit=crop',
		rating: 4.6,
		stock: 15,
		category: 'Vegetables',
		discount: 18,
	},
	{
		id: 2,
		name: 'Fresh Basil Leaves',
		farmer: 'Herb Paradise',
		price: 25,
		originalPrice: null,
		unit: 'bunch',
		image: 'https://images.unsplash.com/photo-1513147122760-ad1d5bf68cdb?w=500&h=300&fit=crop',
		rating: 4.8,
		stock: 8,
		category: 'Herbs',
		discount: null,
	},
	{
		id: 3,
		name: 'Seasonal Fruit Box',
		farmer: 'Orchard Hills',
		price: 120,
		originalPrice: 150,
		unit: 'box',
		image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
		rating: 4.4,
		stock: 0,
		category: 'Fruits',
		discount: 20,
	},
	{
		id: 4,
		name: 'Free-Range Eggs',
		farmer: 'Happy Hens Farm',
		price: 80,
		originalPrice: null,
		unit: 'dozen',
		image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&h=300&fit=crop',
		rating: 4.9,
		stock: 12,
		category: 'Dairy & Eggs',
		discount: null,
	},
	{
		id: 5,
		name: 'Organic Spinach',
		farmer: 'Leafy Greens Co.',
		price: 35,
		originalPrice: 42,
		unit: 'bunch',
		image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=300&fit=crop',
		rating: 4.3,
		stock: 20,
		category: 'Vegetables',
		discount: 17,
	},
	{
		id: 6,
		name: 'Farm Fresh Milk',
		farmer: 'Dairy Delights',
		price: 60,
		originalPrice: null,
		unit: 'liter',
		image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=300&fit=crop',
		rating: 4.7,
		stock: 5,
		category: 'Dairy & Eggs',
		discount: null,
	},
	{
		id: 7,
		name: 'Artisan Honey',
		farmer: 'Bee Happy Apiaries',
		price: 180,
		originalPrice: 220,
		unit: 'jar',
		image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=500&h=300&fit=crop',
		rating: 4.8,
		stock: 0,
		category: 'Pantry',
		discount: 18,
	},
	{
		id: 8,
		name: 'Mixed Salad Greens',
		farmer: 'Fresh Fields',
		price: 40,
		originalPrice: 48,
		unit: 'bag',
		image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
		rating: 4.2,
		stock: 18,
		category: 'Vegetables',
		discount: 17,
	},
];

const WishlistSkeleton = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{Array.from({ length: 8 }).map((_, index) => (
			<div
				key={index}
				className="bg-white rounded-xl border border-secondary-200 p-4 animate-pulse"
			>
				<div className="w-full h-48 bg-secondary-200 rounded-lg mb-4"></div>
				<div className="space-y-3">
					<div className="h-4 bg-secondary-200 rounded w-3/4"></div>
					<div className="h-3 bg-secondary-200 rounded w-1/2"></div>
					<div className="h-3 bg-secondary-200 rounded w-2/3"></div>
					<div className="flex gap-2">
						<div className="h-8 bg-secondary-200 rounded flex-1"></div>
						<div className="h-8 w-8 bg-secondary-200 rounded"></div>
					</div>
				</div>
			</div>
		))}
	</div>
);

function Wishlist() {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate API fetch
		setTimeout(() => {
			setItems(mockWishlist);
			setIsLoading(false);
		}, 1200);
	}, []);

	const removeFromWishlist = (id) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const moveToCart = (product) => {
		console.log('Moving to cart:', product);
		// Here you would typically call an API to add to cart
		removeFromWishlist(product.id);
	};

	const renderStars = (rating) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		return (
			<div className="flex items-center gap-1">
				{Array.from({ length: 5 }).map((_, index) => {
					if (index < fullStars) {
						return <span key={index} className="text-yellow-400">★</span>;
					} else if (index === fullStars && hasHalfStar) {
						return <span key={index} className="text-yellow-400">★</span>;
					} else {
						return <span key={index} className="text-secondary-300">★</span>;
					}
				})}
				<span className="text-sm text-secondary-600 ml-1">({rating})</span>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-secondary-50">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="mb-8">
						<div className="h-8 w-48 bg-secondary-200 rounded animate-pulse mb-2"></div>
						<div className="h-4 w-32 bg-secondary-200 rounded animate-pulse"></div>
					</div>
					<WishlistSkeleton />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-secondary-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
						My Wishlist
					</h1>
					<p className="text-lg text-secondary-600">
						{items.length} item{items.length !== 1 ? 's' : ''} saved for later
					</p>
				</div>

				{items.length === 0 ? (
					/* Empty State */
					<div className="bg-white rounded-xl border border-secondary-200 p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
								<svg
									className="w-12 h-12 text-pink-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-secondary-900 mb-3">
								Your Wishlist is Empty
							</h2>
							<p className="text-secondary-600 mb-8">
								Looks like you haven't added anything to your wishlist yet. Start
								exploring and save your favorites!
							</p>
							<div className="space-y-3">
								<Link
									to="/products"
									className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 w-full justify-center"
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									Discover Products
								</Link>
								<Link
									to="/categories"
									className="inline-flex items-center px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200 w-full justify-center"
								>
									Browse Categories
								</Link>
							</div>
						</div>
					</div>
				) : (
					/* Wishlist Items Grid */
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{items.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-xl border border-secondary-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
							>
								{/* Product Image */}
								<div className="relative">
									<Link to={`/products/${item.id}`}>
										<div className="w-full h-48 bg-secondary-100 overflow-hidden">
											<img
												src={item.image}
												alt={item.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
									</Link>

									{/* Discount Badge */}
									{item.discount && (
										<div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
											{item.discount}% OFF
										</div>
									)}

									{/* Quick Actions */}
									<div className="absolute top-3 right-3 space-y-2">
										<button
											onClick={() => removeFromWishlist(item.id)}
											className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors duration-200 group"
											title="Remove from wishlist"
										>
											<svg
												className="w-4 h-4 text-red-500"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
											</svg>
										</button>
									</div>

									{/* Stock Status Overlay */}
									{item.stock === 0 && (
										<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
											<span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
												Out of Stock
											</span>
										</div>
									)}
								</div>

								{/* Product Details */}
								<div className="p-4">
									<div className="mb-2">
										<span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
											{item.category}
										</span>
									</div>

									<Link to={`/products/${item.id}`}>
										<h3 className="font-semibold text-secondary-900 mb-1 hover:text-primary-600 transition-colors duration-200 line-clamp-2">
											{item.name}
										</h3>
									</Link>

									<p className="text-sm text-secondary-600 mb-2">
										by {item.farmer}
									</p>

									{/* Rating */}
									<div className="mb-3">{renderStars(item.rating)}</div>

									{/* Pricing */}
									<div className="flex items-center gap-2 mb-3">
										<span className="text-lg font-bold text-secondary-900">
											₹{item.price}
										</span>
										{item.originalPrice && item.originalPrice > item.price && (
											<span className="text-sm text-secondary-500 line-through">
												₹{item.originalPrice}
											</span>
										)}
										<span className="text-sm text-secondary-600">
											/ {item.unit}
										</span>
									</div>

									{/* Stock Status */}
									<div className="mb-4">
										<span
											className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
												item.stock > 10
													? 'bg-green-100 text-green-800'
													: item.stock > 0
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-red-100 text-red-800'
											}`}
										>
											{item.stock > 0
												? `${item.stock} in stock`
												: 'Out of stock'}
										</span>
									</div>

									{/* Actions */}
									<div className="space-y-2">
										<button
											onClick={() => moveToCart(item)}
											disabled={item.stock === 0}
											className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
												item.stock === 0
													? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
													: 'bg-primary-600 text-white hover:bg-primary-700'
											}`}
										>
											{item.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Action Bar */}
				{items.length > 0 && (
					<div className="mt-8 bg-white rounded-xl border border-secondary-200 p-6">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<div className="text-sm text-secondary-600">
								Save more with bulk orders and seasonal discounts
							</div>
							<div className="flex gap-3">
								<button
									onClick={() => {
										const availableItems = items.filter((item) => item.stock > 0);
										availableItems.forEach((item) => moveToCart(item));
									}}
									className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
									disabled={items.every((item) => item.stock === 0)}
								>
									Move All to Cart
								</button>
								<Link
									to="/products"
									className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200"
								>
									Continue Shopping
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Wishlist;
