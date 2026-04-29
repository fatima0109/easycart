import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import InfoPage from "./pages/InfoPage";
import ProfilePage from "./pages/ProfilePage";

import CreateProductForm from "./components/CreateProductForm";
import ProductsList from "./components/ProductsList";
import AnalyticsTab from "./components/AnalyticsTab";
import OrdersList from "./components/OrdersList";
import ProductQuickView from "./components/ProductQuickView";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (!user) return; getCartItems(); }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF', color: '#222222', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ paddingTop: '90px', flexGrow: 1 }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchResultsPage />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/info/:type' element={<InfoPage />} />
          <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to="/" />} />

          {/* PROFILE ROUTES */}
          <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to='/login' />}>
            <Route index element={<Navigate to="orders" />} />
            <Route path='orders' element={<OrderHistoryPage />} />
            <Route path='me' element={<div style={{ padding: '1rem', color: '#1F2A44', fontWeight: 700 }}>Personal Info Section</div>} />
            <Route path='settings' element={<div style={{ padding: '1rem', color: '#1F2A44', fontWeight: 700 }}>Settings Section</div>} />
            <Route path='wishlist' element={<div style={{ padding: '1rem', color: '#1F2A44', fontWeight: 700 }}>My Wishlist Section</div>} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path='/secret-dashboard' element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}>
            <Route index element={<Navigate to="analytics" />} />
            <Route path='create' element={<CreateProductForm />} />
            <Route path='products' element={<ProductsList />} />
            <Route path='analytics' element={<AnalyticsTab />} />
            <Route path='orders' element={<OrdersList />} />
          </Route>

          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        </Routes>
      </div>
      <Footer />
      <ProductQuickView /> 
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.88rem', borderRadius: '10px', border: '1px solid #E0E0E0' },
          success: { iconTheme: { primary: '#4CAF50', secondary: '#FFFFFF' } },
          error: { iconTheme: { primary: '#D9534F', secondary: '#FFFFFF' } },
        }}
      />
    </div>
  );
}

export default App;
