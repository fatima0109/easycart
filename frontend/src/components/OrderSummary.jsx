import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "../utils/helpers";

const OrderSummary = () => {
  const { cart, coupon, isCouponApplied, createOrder } = useCartStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let total = subtotal;
  let savings = 0;

  if (isCouponApplied && coupon) {
    savings = subtotal * (coupon.discountPercentage / 100);
    total = subtotal - savings;
  }

  const handleCheckout = async () => {
    const success = await createOrder();
    if (success) {
      toast.success("Order placed successfully!");
      navigate("/purchase-success");
    } else {
      toast.error("Something went wrong with your order.");
    }
  };

  return (
    <motion.div
      className="card p-4 shadow-sm"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '14px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2A44', marginBottom: '1.5rem' }}>
        Order Summary
      </h2>

      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex justify-content-between">
          <span style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Subtotal</span>
          <span style={{ fontWeight: 700, color: '#222222' }}>{formatPrice(subtotal)}</span>
        </div>

        {savings > 0 && (
          <div className="d-flex justify-content-between">
            <span style={{ color: '#4CAF50', fontSize: '0.9rem', fontWeight: 600 }}>Discount Applied</span>
            <span style={{ fontWeight: 700, color: '#4CAF50' }}>-{formatPrice(savings)}</span>
          </div>
        )}

        <div className="d-flex justify-content-between">
          <span style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Shipping</span>
          <span style={{ fontWeight: 700, color: '#4CAF50' }}>FREE</span>
        </div>

        <hr style={{ borderColor: '#F0F0F0', margin: '0.5rem 0' }} />

        <div className="d-flex justify-content-between align-items-center">
          <span style={{ fontWeight: 800, color: '#1F2A44', fontSize: '1.1rem' }}>Total</span>
          <span style={{ fontWeight: 800, color: '#1F2A44', fontSize: '1.3rem' }}>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        style={{
          width: '100%', padding: '14px', borderRadius: '10px',
          backgroundColor: '#1F2A44', color: '#FFFFFF', border: 'none',
          fontWeight: 700, fontSize: '0.95rem', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
          marginBottom: '1rem', transition: 'background 0.2s'
        }}
      >
        Place Order <MoveRight size={18} />
      </button>

      <div className="d-flex align-items-center justify-content-center gap-2" style={{ color: '#9E9E9E', fontSize: '0.75rem' }}>
        <ShieldCheck size={14} />
        <span>Secure Order Processing</span>
      </div>
    </motion.div>
  );
};

export default OrderSummary;