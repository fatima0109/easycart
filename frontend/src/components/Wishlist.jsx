import { Trash2, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const Wishlist = () => {
	const { wishlist, removeFromWishlist } = useWishlistStore();
	const { addToCart } = useCartStore();

	if (wishlist.length === 0) {
		return (
			<div className='text-center py-5'>
				<p className='text-[#6B6B6B] mb-4'>Your wishlist is empty.</p>
				<Link to='/search' className='btn text-white px-4 py-2 rounded-lg' style={{ backgroundColor: '#1F2A44' }}>
					Discover Products
				</Link>
			</div>
		);
	}

	return (
		<div>
			<h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2A44', marginBottom: '1.5rem' }}>
				Saved Items ({wishlist.length})
			</h2>
			<div className='row g-4'>
				{wishlist.map((product) => (
					<div key={product._id} className='col-md-6 col-xl-4'>
						<div className='card h-100 border-[#E0E0E0]' style={{ borderRadius: '12px', overflow: 'hidden' }}>
							<img src={product.image} alt={product.name} style={{ height: '160px', objectFit: 'cover' }} />
							<div className='card-body p-3'>
								<h6 className='fw-bold mb-1 text-truncate'>{product.name}</h6>
								<p className='text-[#C97C5D] fw-bold mb-3'>${product.price}</p>
								
								<div className='d-flex gap-2'>
									<button 
										onClick={() => addToCart(product)}
										className='btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 text-white btn-sm'
										style={{ backgroundColor: '#1F2A44' }}
									>
										<ShoppingCart size={14} /> Add
									</button>
									<button 
										onClick={() => removeFromWishlist(product._id)}
										className='btn border-[#E0E0E0] text-danger btn-sm'
									>
										<Trash2 size={14} />
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