import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const EmptyCartUI = () => (
  <div className="text-center py-5">
    <div style={{
      width: '90px', height: '90px', borderRadius: '50%',
      backgroundColor: 'rgba(201,124,93,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 1.5rem'
    }}>
      <ShoppingCart size={40} style={{ color: '#C97C5D' }} />
    </div>
    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1F2A44', marginBottom: '0.5rem' }}>
      Your cart is empty
    </h2>
    <p style={{ color: '#6B6B6B', marginBottom: '1.5rem' }}>
      Looks like you haven't added anything yet.
    </p>
    <Link
      to="/"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        backgroundColor: '#C97C5D', color: '#FFFFFF',
        padding: '12px 28px', borderRadius: '8px',
        fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem'
      }}
    >
      <ArrowLeft size={16} /> Continue Shopping
    </Link>
  </div>
);

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container">

        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(201,124,93,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={20} style={{ color: '#C97C5D' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2A44', marginBottom: 0 }}>Shopping Cart</h1>
            <p style={{ color: '#6B6B6B', fontSize: '0.85rem', marginBottom: 0 }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>

        <div className="row g-4">
          
          {/* 1. Cart Items */}
          <div className="col-lg-8 order-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {cart.length === 0 ? (
                <div className="card p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '14px' }}>
                  <EmptyCartUI />
                </div>
              ) : (
                <div className="card p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '14px' }}>
                  <div className="d-flex flex-column gap-4">
                    {cart.map((item, i) => (
                      <div key={item._id}>
                        <CartItem item={item} />
                        {i < cart.length - 1 && <hr style={{ borderColor: '#F0F0F0', margin: '1rem 0 0' }} />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3" style={{ borderTop: '1px solid #E0E0E0' }}>
                    <Link
                      to="/"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B6B6B', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}
                    >
                      <ArrowLeft size={15} /> Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 2. Sidebar (Checkout & Coupon) - Now order-2, meaning it renders ABOVE PeopleAlsoBought on Mobile */}
          {cart.length > 0 && (
            <div className="col-lg-4 order-2">
              <div className="sticky-top d-flex flex-column gap-3">
                <OrderSummary />
                <GiftCouponCard />
              </div>
            </div>
          )}

          {/* 3. People Also Bought - Extracted from Cart Items column to fix mobile order */}
          {cart.length > 0 && (
            <div className="col-lg-8 order-3">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <PeopleAlsoBought />
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartPage;