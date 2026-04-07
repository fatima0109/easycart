import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(data);
  };

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrders();
  };

  return (
    <div>
      <h2>All Orders</h2>
      {orders.map(order => (
        <div key={order._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
          <p><strong>Address:</strong> {order.shippingAddress}</p>
          <p><strong>Total:</strong> ${order.totalPrice}</p>
          <p><strong>Status:</strong> 
            <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)}>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </p>
          <ul>
            {order.orderItems.map(item => (
              <li key={item._id}>{item.name} x {item.quantity} = ${item.price * item.quantity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}