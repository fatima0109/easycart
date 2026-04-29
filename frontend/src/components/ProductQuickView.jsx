import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useQuickViewStore } from "../stores/useQuickViewStore";
import { useState } from "react";

const ProductQuickView = () => {
	const { isOpen, product, closeQuickView } = useQuickViewStore();
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const [quantity, setQuantity] = useState(1);

	if (!isOpen || !product) return null;

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart");
			return;
		}
		for (let i = 0; i < quantity; i++) { addToCart(product); }
		toast.success(`${quantity} item(s) added to cart`);
		closeQuickView();
	};

	return (
		<AnimatePresence mode="wait">
			{isOpen && product && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={closeQuickView}
					style={{
						position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
						backgroundColor: 'rgba(31, 42, 68, 0.7)', backdropFilter: 'blur(6px)',
						zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px'
					}}
				>
					<motion.div
						key={product._id} 
						initial={{ scale: 0.95, opacity: 0, y: 30 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: 30 }}
						onClick={(e) => e.stopPropagation()}
						style={{
							backgroundColor: '#FFFFFF', width: '100%', maxWidth: '950px', // Increased width to give more room
							maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px',
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)', position: 'relative'
						}}
					>
						{/* Header */}
						<div style={{
							position: 'sticky', top: 0, backgroundColor: '#FFFFFF',
							padding: '15px 25px', display: 'flex', justifyContent: 'space-between',
							alignItems: 'center', borderBottom: '1px solid #F0F0F0', zIndex: 10
						}}>
							<span style={{ fontWeight: 800, color: '#1F2A44', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
								Quick Details
							</span>
							<button onClick={closeQuickView} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer' }}>
								<X size={24} />
							</button>
						</div>

						<div style={{ padding: '30px' }}>
							<div className="row g-4"> {/* Added gap between columns */}
								{/* Image Column */}
								<div className="col-lg-6">
									<div style={{
										backgroundColor: '#FAFAFA', 
                                        borderRadius: '15px', 
                                        padding: '20px',
										border: '1px solid #F0F0F0', 
                                        height: '100%', // Makes container match the text column height
                                        minHeight: '500px', // Ensures it doesn't get too small
                                        display: 'flex',
										alignItems: 'center', 
                                        justifyContent: 'center',
                                        position: 'sticky', // Keeps image visible while scrolling long text
                                        top: '20px'
									}}>
										<img 
											src={product.image} 
											alt={product.name} 
											style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '600px', // INCREASED HEIGHT
                                                objectFit: 'contain' 
                                            }} 
										/>
									</div>
								</div>

								{/* Content Column */}
								<div className="col-lg-6 d-flex flex-column">
									<small style={{ color: '#C97C5D', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>
										{product.category}
									</small>
									<h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#222222', margin: '8px 0' }}>
										{product.name}
									</h2>
									
									<div className="d-flex align-items-center gap-2 mb-3">
										<div className="d-flex gap-1">
											{[...Array(4)].map((_, i) => <Star key={i} size={14} fill="#C97C5D" color="#C97C5D" />)}
											<Star size={14} color="#E0E0E0" />
										</div>
										<span style={{ fontSize: '12px', color: '#9E9E9E' }}>(4.8 / 5.0)</span>
									</div>

									<h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1F2A44', marginBottom: '20px' }}>
										${product.price}
									</h3>

									<div style={{ backgroundColor: '#F5F3EF', padding: '18px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #EAE8E4' }}>
										<p style={{ margin: 0, fontSize: '14px', color: '#6B6B6B', lineHeight: '1.8' }}>
											{product.description || "Crafted for the modern professional, this piece combines timeless formal aesthetics with premium comfort and durability."}
										</p>
									</div>

									{/* Quantity and Actions */}
									<div className="mt-auto pt-4">
										<div className="d-flex align-items-center gap-3 mb-4">
											<div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
												<button 
													onClick={() => setQuantity(Math.max(1, quantity - 1))} 
													style={{ width: '45px', height: '45px', border: 'none', backgroundColor: '#FFFFFF', fontWeight: 'bold' }}
												>-</button>
												<span style={{ width: '45px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
												<button 
													onClick={() => setQuantity(quantity + 1)} 
													style={{ width: '45px', height: '45px', border: 'none', backgroundColor: '#FFFFFF', fontWeight: 'bold' }}
												>+</button>
											</div>
											<button
												onClick={handleAddToCart}
												style={{
													flexGrow: 1, padding: '12px 25px', backgroundColor: '#C97C5D',
													color: '#FFFFFF', border: 'none', borderRadius: '8px',
													fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
												}}
											>
												<ShoppingCart size={18} /> Add to Cart
											</button>
										</div>

										<div className="d-flex align-items-center gap-2" style={{ color: '#4CAF50', fontSize: '12px', fontWeight: 700 }}>
											<ShieldCheck size={16} /> Secure Payment & Quality Guaranteed
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProductQuickView;