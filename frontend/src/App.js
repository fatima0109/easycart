import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';          // <-- add
import Register from './pages/Register';    // <-- add

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />          // <-- add
            <Route path="/register" element={<Register />} />    // <-- add
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/myorders" element={<OrderHistory />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;