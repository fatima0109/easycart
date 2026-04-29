import { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { Package, CheckCircle, ChevronRight, Loader } from "lucide-react";
import { formatPrice } from "../utils/helpers";
import OrderDetailsModal from "../components/OrderDetailsModal"; // Import the modal

const OrderHistoryPage = () => {
	const { userOrders, fetchUserOrders, loading, setSelectedOrder } = useOrderStore();

	useEffect(() => {
		fetchUserOrders();
	}, [fetchUserOrders]);

	if (loading) {
		return (
			<div className="d-flex flex-column align-items-center justify-content-center py-5">
				<Loader className="animate-spin text-[#1F2A44] mb-2" size={32} />
				<p className="text-muted small fw-bold">RETRIEVING ORDERS...</p>
			</div>
		);
	}

	if (userOrders.length === 0) {
		return (
			<div className="text-center py-5">
				<div className="bg-[#F5F3EF] d-inline-flex p-4 rounded-circle mb-3">
					<Package size={40} className="text-[#9E9E9E]" />
				</div>
				<h5 className="fw-bold text-[#1F2A44]">No orders found</h5>
				<p className="text-muted small">Your purchase history is currently empty.</p>
			</div>
		);
	}

	return (
		<div>
			<h4 className="fw-bold text-[#1F2A44] mb-4">Order History</h4>
			
			<div className="d-flex flex-column gap-3">
				{userOrders.map((order) => (
					<div 
						key={order._id} 
						className="card shadow-sm border-0" 
						style={{ backgroundColor: '#FAFAFA', borderRadius: '12px', border: '1px solid #E0E0E0' }}
					>
						<div className="card-body p-3 p-md-4">
							<div className="d-flex justify-content-between align-items-start mb-3">
								<div>
									<div className="text-muted mb-1" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
										Order ID: #{order._id.slice(-8).toUpperCase()}
									</div>
									<div className="fw-bold text-[#1F2A44]">
										{new Date(order.createdAt).toLocaleDateString('en-US', { 
											month: 'long', day: 'numeric', year: 'numeric' 
										})}
									</div>
								</div>
								<div className="text-end">
									<span style={{
										padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
										backgroundColor: order.status === 'Delivered' ? '#D1FAE5' : '#FEF3C7',
										color: order.status === 'Delivered' ? '#065F46' : '#92400E'
									}}>
										{order.status}
									</span>
									<div className="mt-2 fw-bold text-[#1F2A44]" style={{ fontSize: '1.1rem' }}>
										{formatPrice(order.totalAmount)}
									</div>
								</div>
							</div>

							<div className="pt-3 border-top d-flex justify-content-between align-items-center">
								<div className="text-muted small">
									<CheckCircle size={14} className="me-1 text-success" /> 
									{order.products.length} Item(s) Purchased
								</div>
								{/* ACTION BUTTON TRIGGER */}
								<button 
									className="btn btn-sm fw-bold d-flex align-items-center gap-1" 
									style={{ color: '#C97C5D', padding: '5px 10px' }}
									onClick={() => setSelectedOrder(order)}
								>
									View Details <ChevronRight size={14} />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* THE MODAL COMPONENT */}
			<OrderDetailsModal />
		</div>
	);
};

export default OrderHistoryPage;