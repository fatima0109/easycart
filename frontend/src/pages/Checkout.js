import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!user) return alert('Please login first');
    const orderItems = cart.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/orders', { orderItems, shippingAddress: address }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      clearCart();
      alert('Order placed!');
      navigate('/myorders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Checkout</h2>
      {cart.map(item => (
        <div key={item.product}>{item.name} x{item.quantity} = ${item.price * item.quantity}</div>
      ))}
      <h3>Total: ${total}</h3>
      <input type="text" placeholder="Shipping address" value={address} onChange={e => setAddress(e.target.value)} />
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}