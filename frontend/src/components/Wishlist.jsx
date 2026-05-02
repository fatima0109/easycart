import { Trash2, ShoppingCart, Heart, Eye } from "lucide-react";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useCartStore } from "../stores/useCartStore";
import { useQuickViewStore } from "../stores/useQuickViewStore"; // NEW: Import QuickView Store
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Wishlist = () => {
	const { wishlist, toggleWishlist } = useWishlistStore();
	const { addToCart } = useCartStore();
	const { openQuickView } = useQuickViewStore(); // NEW: Get global trigger

	if (wishlist.length === 0) {
		return (
			<div className='text-center py-5'>
				<Heart size={48} className='mx-auto mb-3 text-[#E0E0E0]' />
				<h5 className='fw-bold text-[#1F2A44]'>Your wishlist is empty</h5>
				<p className='text-[#6B6B6B] mb-4'>Save items you like to find them easily later.</p>
				<Link
					to='/search'
					className='btn text-white px-4 py-2 rounded-lg border-0'
					style={{ backgroundColor: "#C97C5D" }}
				>
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div>
			<h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1F2A44", marginBottom: "1.5rem" }}>
				My Wishlist ({wishlist.length})
			</h2>
			<div className='row g-3'>
				{wishlist.map((product) => (
					<div key={product._id} className='col-md-6 col-xl-4'>
						<div
							className='card h-100 shadow-sm'
							style={{ border: "1px solid #E0E0E0", borderRadius: "12px", overflow: "hidden" }}
						>
							{/* IMAGE SECTION */}
							<div
								style={{ height: "150px", backgroundColor: "#FAFAFA", padding: "10px" }}
								className='position-relative overflow-hidden'
							>
								<img
									src={product.image}
									alt={product.name}
									className='w-100 h-100'
									style={{ objectFit: "contain", cursor: "pointer" }}
									onClick={() => openQuickView(product)} // OPEN QUICK VIEW ON CLICK
								/>

								{/* Quick View Trigger (The Eye) */}
								<button
									onClick={() => openQuickView(product)} // OPEN QUICK VIEW ON CLICK
									style={{
										position: "absolute", bottom: "8px", right: "8px",
										width: "30px", height: "30px", borderRadius: "50%",
										backgroundColor: "#FFFFFF", border: "none", display: "flex",
										alignItems: "center", justifyContent: "center",
										boxShadow: "0 2px 6px rgba(0,0,0,0.15)", cursor: "pointer", zIndex: 10,
									}}
								>
									<Eye size={15} style={{ color: "#1F2A44" }} />
								</button>
							</div>

							{/* CARD BODY */}
							<div className='card-body p-3'>
								<h6
									className='fw-bold mb-1 text-truncate'
									style={{ color: "#222222", cursor: "pointer" }}
									onClick={() => openQuickView(product)} // OPEN QUICK VIEW ON TITLE CLICK
								>
									{product.name}
								</h6>
								<p className='fw-bold mb-3' style={{ color: "#C97C5D" }}>
									${product.price}
								</p>

								<div className='d-flex gap-2'>
									<button
										onClick={() => { addToCart(product); toast.success("Added to cart"); }}
										className='btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 text-white btn-sm border-0'
										style={{ backgroundColor: "#1F2A44", borderRadius: "8px" }}
									>
										<ShoppingCart size={14} /> Add
									</button>
									<button
										onClick={() => toggleWishlist(product)}
										className='btn border-0 text-danger btn-sm'
										style={{ backgroundColor: "#F5F3EF", borderRadius: "8px" }}
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Wishlist;