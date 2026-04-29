import { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { Loader, User, Calendar, CreditCard } from "lucide-react";
import { formatPrice } from "../utils/helpers";

const OrdersList = () => {
	const { orders, fetchAllOrders, loading, updateStatus } = useOrderStore();

	useEffect(() => {
		fetchAllOrders();
	}, [fetchAllOrders]);

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
				<Loader className="animate-spin text-[#1F2A44]" size={40} />
			</div>
		);
	}

	return (
		<div className="p-4">
			<h4 className="mb-4" style={{ fontWeight: 800, color: '#1F2A44' }}>Manage All Orders</h4>

			{orders.length === 0 ? (
				<div className="text-center py-5 bg-[#FAFAFA] rounded-3 border">
					<p className="text-muted mb-0">No orders found in the database.</p>
				</div>
			) : (
				<div className="table-responsive">
					<table className="table border" style={{ borderRadius: '12px', overflow: 'hidden' }}>
						<thead style={{ backgroundColor: '#1F2A44', color: '#FFFFFF' }}>
							<tr>
								<th className="px-4 py-3 border-0">CUSTOMER</th>
								<th className="px-4 py-3 border-0">DATE</th>
								<th className="px-4 py-3 border-0">TOTAL</th>
								<th className="px-4 py-3 border-0">STATUS</th>
								<th className="px-4 py-3 border-0">UPDATE</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order._id} style={{ verticalAlign: 'middle' }}>
									<td className="px-4 py-3">
										<div className="d-flex align-items-center gap-2">
											<div className="bg-[#F5F3EF] p-2 rounded-circle">
												<User size={16} className="text-[#1F2A44]" />
											</div>
											<div>
												<div style={{ fontWeight: 700, color: '#222222' }}>{order.user?.name || "Deleted User"}</div>
												<div style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>{order.user?.email}</div>
											</div>
										</div>
									</td>
									<td className="px-4 py-3 text-muted" style={{ fontSize: '0.85rem' }}>
										<div className="d-flex align-items-center gap-1">
											<Calendar size={14} />
											{new Date(order.createdAt).toLocaleDateString()}
										</div>
									</td>
									<td className="px-4 py-3">
										<span style={{ fontWeight: 800, color: '#1F2A44' }}>
											{formatPrice(order.totalAmount)}
										</span>
									</td>
									<td className="px-4 py-3">
										<span style={{
											padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
											backgroundColor: order.status === 'Delivered' ? '#D1FAE5' : '#FEF3C7',
											color: order.status === 'Delivered' ? '#065F46' : '#92400E'
										}}>
											{order.status}
										</span>
									</td>
									<td className="px-4 py-3">
										<select
											className="form-select form-select-sm"
											style={{ width: '140px', fontSize: '0.8rem', fontWeight: 600 }}
											value={order.status}
											onChange={(e) => updateStatus(order._id, e.target.value)}
										>
											<option value="Processing">Processing</option>
											<option value="Shipped">Shipped</option>
											<option value="Delivered">Delivered</option>
											<option value="Cancelled">Cancelled</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default OrdersList;