import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import "./Cart.css";

// Mock cart data for development (kept for UI-only)
const mockCartItems = [
	{
		id: 1,
		productId: 1,
		name: "Fresh Organic Tomatoes",
		price: 45,
		image: "/src/assets/icons/box.svg",
		quantity: 2,
		unit: "kg",
		stock: 50,
	},
	{
		id: 2,
		productId: 3,
		name: "Fresh Milk",
		price: 60,
		image: "/src/assets/icons/box.svg",
		quantity: 1,
		unit: "liter",
		stock: 20,
	},
];

function formatINR(value) {
	if (value == null) return "—";
	try {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);
	} catch {
		return `₹${value}`;
	}
}

function Cart() {
	const [cartItems, setCartItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// simulate API call
		const t = setTimeout(() => {
			setCartItems(mockCartItems);
			setIsLoading(false);
		}, 700);
		return () => clearTimeout(t);
	}, []);

	const updateQuantity = (itemId, newQuantity) => {
		setCartItems((prev) =>
			prev.map((item) =>
				item.id === itemId
					? { ...item, quantity: Math.max(1, Math.min(item.stock || 9999, newQuantity || 1)) }
					: item
			)
		);
	};

	const removeItem = (itemId) => {
		setCartItems((prev) => prev.filter((item) => item.id !== itemId));
	};

	const subtotal = useMemo(
		() => cartItems.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 0)), 0),
		[cartItems]
	);

	const deliveryCharge = useMemo(() => (subtotal >= 500 || subtotal === 0 ? 0 : 50), [subtotal]);

	const total = useMemo(() => subtotal + deliveryCharge, [subtotal, deliveryCharge]);

	if (isLoading) {
		return (
			<div className="ac-container">
				<Loader size="large" text="Loading cart..." />
			</div>
		);
	}

	if (!cartItems.length) {
		return (
			<div className="ac-empty-cart">
				<div className="ac-container">
					<div className="ac-empty-cart__content">
						<img src="/src/assets/icons/cart.svg" alt="" className="ac-empty-cart__img" />
						<h2>Your cart is empty</h2>
						<p>Looks like you haven't added any products to your cart yet.</p>
						<Link to="/products" className="ac-btn ac-btn--primary">
							Start Shopping
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="ac-cart-page">
			<div className="ac-container">
				<h1 className="ac-page-title">Shopping Cart</h1>

				<div className="ac-cart-layout" role="region" aria-label="Shopping cart">
					{/* Cart Items */}
					<div className="ac-cart-items" aria-live="polite">
						{cartItems.map((item) => (
							<div key={item.id} className="ac-cart-item" role="group" aria-label={item.name}>
								<div className="ac-cart-item__image">
									<img src={item.image} alt={item.name} className="ac-cart-item-img" />
								</div>

								<div className="ac-cart-item__details">
									<h3 className="ac-cart-item__name">{item.name}</h3>
									<p className="ac-cart-item__price">
										{formatINR(item.price)} / {item.unit}
									</p>
									<div className="ac-cart-item__stock">
										<span className={`ac-stock-status ${item.stock > 0 ? "in-stock" : "out-of-stock"}`}>
											{item.stock > 0 ? `In stock (${item.stock} ${item.unit})` : "Out of stock"}
										</span>
									</div>
								</div>

								<div className="ac-cart-item__quantity" aria-label="Quantity controls">
									<label htmlFor={`quantity-${item.id}`} className="ac-visually-hidden">
										Quantity
									</label>
									<div className="ac-quantity-controls" role="group" aria-label={`Quantity for ${item.name}`}>
										<button
											onClick={() => updateQuantity(item.id, item.quantity - 1)}
											disabled={item.quantity <= 1}
											className="ac-quantity-btn"
											aria-label={`Decrease quantity of ${item.name}`}
										>
											−
										</button>
										<input
											type="number"
											id={`quantity-${item.id}`}
											className="ac-quantity-input"
											value={item.quantity}
											min="1"
											max={item.stock || 9999}
											onChange={(e) => {
												const v = parseInt(e.target.value, 10);
												if (Number.isNaN(v)) return;
												updateQuantity(item.id, v);
											}}
											aria-label={`Quantity for ${item.name}`}
										/>
										<button
											onClick={() => updateQuantity(item.id, item.quantity + 1)}
											disabled={item.quantity >= (item.stock || 9999)}
											className="ac-quantity-btn"
											aria-label={`Increase quantity of ${item.name}`}
										>
											+
										</button>
									</div>
								</div>

								<div className="ac-cart-item__total">
									<span className="ac-item-total">{formatINR(item.price * item.quantity)}</span>
								</div>

								<div className="ac-cart-item__actions">
									<button
										onClick={() => removeItem(item.id)}
										className="ac-btn ac-btn--ghost ac-btn--small"
										aria-label={`Remove ${item.name}`}
										title="Remove"
									>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Cart Summary */}
					<aside className="ac-cart-summary" aria-labelledby="order-summary-heading">
						<h3 id="order-summary-heading">Order Summary</h3>

						<div className="ac-summary-row">
							<span>Subtotal ({cartItems.reduce((c, it) => c + it.quantity, 0)} items)</span>
							<span>{formatINR(subtotal)}</span>
						</div>

						<div className="ac-summary-row">
							<span>Delivery Charge</span>
							<span>{deliveryCharge === 0 ? "Free" : formatINR(deliveryCharge)}</span>
						</div>

						{deliveryCharge > 0 && (
							<div className="ac-delivery-info">
								<p>Add {formatINR(500 - subtotal)} more for free delivery!</p>
							</div>
						)}

						<div className="ac-summary-row ac-summary-total">
							<span>Total</span>
							<span>{formatINR(total)}</span>
						</div>

						<div className="ac-cart-actions">
							<Link to="/checkout" className="ac-btn ac-btn--primary ac-btn--full" aria-label="Proceed to checkout">
								Proceed to Checkout
							</Link>
							<Link to="/products" className="ac-btn ac-btn--ghost ac-btn--full" aria-label="Continue shopping">
								Continue Shopping
							</Link>
						</div>

						<div className="ac-cart-benefits" aria-hidden="true">
							<div className="ac-benefit">
								<span className="ac-benefit-icon">🚚</span>
								<span>Free delivery on orders above ₹500</span>
							</div>
							<div className="ac-benefit">
								<span className="ac-benefit-icon">🔄</span>
								<span>Easy returns & exchanges</span>
							</div>
							<div className="ac-benefit">
								<span className="ac-benefit-icon">🔒</span>
								<span>Secure payment options</span>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

export default Cart;
