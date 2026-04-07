import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#333', color: 'white' }}>
      <Link to="/" style={{ color: 'white' }}>Home</Link>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <Link to="/myorders" style={{ color: 'white' }}>My Orders</Link>
          {user.role === 'admin' && <Link to="/admin" style={{ color: 'white' }}>Admin</Link>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: 'white' }}>Login</Link>
          <Link to="/register" style={{ color: 'white' }}>Register</Link>
        </>
      )}
      <Link to="/checkout" style={{ color: 'white' }}>Cart ({cart.length})</Link>
    </nav>
  );
}