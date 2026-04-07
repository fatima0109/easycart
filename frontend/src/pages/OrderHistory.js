// OrderHistory.js (simplified)
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/orders/myorders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data));
  }, []);
  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <p>Order ID: {order._id} | Total: ${order.totalPrice} | Status: {order.orderStatus}</p>
          <ul>{order.orderItems.map(item => <li key={item._id}>{item.name} x {item.quantity}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}