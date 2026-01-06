import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsBySellerId } from '../Slice/itemSlice'
import { fetchSellerByUserId } from '../Slice/sellersSlice'

const ShopDetail = ({ userId }) => {
	const { id } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const seller = useSelector((state) => state.sellers.seller)
	const sellerStatus = useSelector((state) => state.sellers.status)

	const items = useSelector((state) => state.items.items || [])
	const itemsStatus = useSelector((state) => state.items.status)

	useEffect(() => {
		if (!id) return
		// `id` is the seller's userId (from /shop/:id links)
		dispatch(fetchSellerByUserId(id))
		dispatch(fetchItemsBySellerId(id))
	}, [dispatch, id])

	return (
		<div className="container">
			<div className="page-header-row">
				<div className="page-icon" aria-hidden>🛍️</div>
				<div>
					<h3 style={{margin:0}}>Shop</h3>
					<p className="muted" style={{margin:0}}>Details and items for this seller.</p>
				</div>
			</div>
			<h2>Shop</h2>

			{sellerStatus === 'loading' && <div className="nav-loading">Loading seller...</div>}

			{seller && (
				<div className="profile-container shop-detail-seller">
					<div className="shop-detail-seller-inner">
						<div className="seller-avatar">
							{seller.image ? (
								<img src={seller.image} alt={seller.name} />
							) : (
								<div>{seller.name?.charAt(0)}</div>
							)}
						</div>

						<div className="seller-info">
							<div className="seller-name">{seller.name}</div>
							<div className="seller-phone">{seller.phoneNo}</div>
							<div className={`seller-status shop-status ${seller.status === 'active' ? 'active' : 'inactive'}`}>{seller.status}</div>
							{seller.category && <div style={{ color: 'var(--muted)', marginTop: 6 }}>{seller.category}</div>}
						</div>
					</div>
				</div>
			)}

			{itemsStatus === 'loading' && <div className="nav-loading">Loading items...</div>}

			<div className="shop-detail-grid">
				{items.length === 0 && itemsStatus !== 'loading' && <div>No items for this shop</div>}

				{items.map((it) => (
					<div className="shop-item-card" key={it._id}>
						<div className="shop-item-thumb">
							{it.image ? <img src={it.image} alt={it.name} /> : <div className="shop-item-placeholder">{it.name?.charAt(0)}</div>}
						</div>
						<div className="shop-item-body">
							<div className="shop-item-title">{it.name}</div>
							<div className="shop-item-desc">{it.description || 'No description'}</div>
							<div className="shop-item-meta">{it.category} • ${it.price}</div>
							<div style={{ marginTop: 10 }}>
								<button
									className="btn chat"
									onClick={() => {
											const client = userId || 'guest'
											const sellerIdVal = seller?.userId || seller?._id || id
											const itemIdVal = it?._id || it?.id
											navigate(`/chat/${encodeURIComponent(itemIdVal)}/${encodeURIComponent(client)}/${encodeURIComponent(sellerIdVal)}`)
										}}
								>
									Chat
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default ShopDetail

