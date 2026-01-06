import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSellers } from "../Slice/sellersSlice";

const Shop = () => {
	const dispatch = useDispatch();
	const sellers = useSelector((state) => state.sellers.sellers || []);
	const status = useSelector((state) => state.sellers.status);

	useEffect(() => {
		dispatch(fetchAllSellers());
	}, [dispatch]);

	return (
		<div className="container">
			{/* Hero */}
			<div className="shop-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1400&q=80)` }}>
				<div className="shop-hero-overlay">
					<div className="shop-hero-content">
						<h1>Discover Local Shops</h1>
						<p className="lead">Browse curated storefronts and find unique items, services, and talents from trusted sellers nearby. Tap a shop to see their items, contact them, or start a chat.</p>
						<div className="shop-hero-icons">
							<span className="badge">🛍️ Shops</span>
							<span className="badge">⭐ Trusted</span>
							<span className="badge">You can chat seller</span>
						</div>
					</div>
				</div>
			</div>

			<div className="page-header-row">
				<div className="page-icon" aria-hidden>🛍️</div>
				<div>
					<h3 style={{margin:0}}>Shops</h3>
					<p className="muted" style={{margin:0}}>Browse available shops and their items.</p>
				</div>
			</div>
			<h2 style={{ marginBottom: 12 }}>Shops</h2>

			{status === "loading" && <div className="nav-loading">Loading sellers...</div>}

			<div className="shop-grid">
				{sellers.map((s) => (
					<Link to={`/shop/${s.userId}`} className="shop-card" key={s._id}>
						<div className="shop-avatar-wrap">
							{s.image ? (
								<img src={s.image} alt={s.name} className="shop-avatar" />
							) : (
								<img src={`https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=60`} alt={s.name} className="shop-avatar" />
							)}
						</div>

						<div className="shop-info">
							<div className="shop-name">{s.name}</div>
							<div className="shop-meta">
								<span className="shop-category">{s.category}</span>
								<span className={"shop-status " + (s.status === "active" ? "active" : "inactive")}>{s.status}</span>
							</div>
							<p className="shop-desc">{s.description || "Quality local sellers. Click to view storefront and items."}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Shop;

