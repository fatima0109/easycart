import { motion, AnimatePresence } from "framer-motion";
import { X, Package, CheckCircle, Info } from "lucide-react";
import { useOrderStore } from "../stores/useOrderStore";
import { formatPrice } from "../utils/helpers";

const OrderDetailsModal = () => {
	const { selectedOrder, closeModal } = useOrderStore();

	if (!selectedOrder) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={closeModal}
				style={{
					position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
					backgroundColor: 'rgba(31, 42, 68, 0.75)', backdropFilter: 'blur(5px)',
					zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px'
				}}
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.95, opacity: 0, y: 20 }}
					onClick={(e) => e.stopPropagation()}
					style={{
						backgroundColor: '#FFFFFF', width: '100%', maxWidth: '550px',
						maxHeight: '85vh', overflowY: 'auto', borderRadius: '20px',
						boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative'
					}}
				>
					{/* Modal Header */}
					<div style={{ 
						padding: '20px 25px', borderBottom: '1px solid #F0F0F0', 
						display: 'flex', justifyContent: 'space-between', alignItems: 'center',
						position: 'sticky', top: 0, background: 'white', zIndex: 10 
					}}>
						<div>
							<h6 style={{ margin: 0, fontWeight: 800, color: '#1F2A44' }}>Order Summary</h6>
							<small style={{ color: '#9E9E9E', fontSize: '11px', fontWeight: 700 }}>#{selectedOrder._id.toUpperCase()}</small>
						</div>
						<button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer' }}>
							<X size={20} />
						</button>
					</div>

					<div style={{ padding: '25px' }}>
						{/* Status Banner */}
						<div className="d-flex align-items-center gap-2 mb-4 p-3 rounded-3" style={{ backgroundColor: '#F5F3EF', border: '1px solid #EAE8E4' }}>
							<Package size={18} style={{ color: '#C97C5D' }} />
							<span style={{ fontSize: '13px', fontWeight: 700, color: '#1F2A44' }}>
								Status: <span style={{ color: '#C97C5D' }}>{selectedOrder.status}</span>
							</span>
						</div>

						{/* Items List */}
						<p style={{ fontSize: '11px', fontWeight: 800, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Items</p>
						<div className="d-flex flex-column gap-3 mb-4">
							{selectedOrder.products.map((item, idx) => (
								<div key={idx} className="d-flex align-items-center gap-3">
									<div style={{ width: '55px', height: '55px', backgroundColor: '#FAFAFA', borderRadius: '10px', border: '1px solid #F0F0F0', overflow: 'hidden', flexShrink: 0 }}>
										<img 
											src={item.product?.image || 'https://via.placeholder.com/100'} 
											alt="" 
											style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
										/>
									</div>
									<div className="flex-grow-1">
										<div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#222222', lineHeight: 1.2 }}>{item.product?.name || "Product Item"}</div>
										<div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
									</div>
									<div style={{ fontWeight: 800, color: '#1F2A44', fontSize: '0.9rem' }}>
										{formatPrice(item.price * item.quantity)}
									</div>
								</div>
							))}
						</div>

						{/* Price Calculation */}
						<div style={{ borderTop: '2px dashed #F0F0F0', paddingTop: '20px' }}>
							<div className="d-flex justify-content-between mb-2">
								<span style={{ color: '#6B6B6B', fontSize: '14px' }}>Subtotal</span>
								<span style={{ fontWeight: 600 }}>{formatPrice(selectedOrder.totalAmount)}</span>
							</div>
							<div className="d-flex justify-content-between mb-3">
								<span style={{ color: '#6B6B6B', fontSize: '14px' }}>Shipping</span>
								<span style={{ fontWeight: 700, color: '#4CAF50' }}>FREE</span>
							</div>
							<div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#1F2A44' }}>
								<span style={{ color: '#FFFFFF', fontWeight: 700 }}>Total Paid</span>
								<span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.2rem' }}>{formatPrice(selectedOrder.totalAmount)}</span>
							</div>
						</div>

						<div className="mt-4 text-center">
							<p style={{ fontSize: '12px', color: '#9E9E9E', margin: 0 }}>
								<CheckCircle size={12} className="me-1" />
								Order verified and processed successfully.
							</p>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default OrderDetailsModal;