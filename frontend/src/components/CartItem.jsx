import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4"
    >
      {/* Image */}
      <div style={{ width: '100%', maxWidth: '100px', flexShrink: 0 }}>
        <img
          src={item.image}
          alt={item.name}
          className="img-fluid rounded-3"
          style={{ aspectRatio: '1/1', objectFit: 'cover', border: '1px solid #E0E0E0' }}
        />
      </div>

      {/* Info */}
      <div className="flex-grow-1 text-center text-md-start">
        <h6 style={{ fontWeight: 700, color: '#222222', marginBottom: '4px' }}>{item.name}</h6>
        <p className="d-none d-sm-block" style={{ fontSize: '0.82rem', color: '#6B6B6B', marginBottom: '8px' }}>
          {item.description}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="d-flex align-items-center gap-1"
          style={{ border: 'none', background: 'none', color: '#D9534F', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
        >
          <Trash2 size={13} /> Remove
        </button>
      </div>

      {/* Quantity + Price */}
      <div className="d-flex align-items-center justify-content-between w-100" style={{ maxWidth: '240px', gap: '1.5rem' }}>
        {/* Quantity Stepper */}
        <div className="d-flex align-items-center" style={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            style={{ width: '34px', height: '34px', border: 'none', background: '#FAFAFA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6B6B', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F0F0'}
            onMouseLeave={e => e.currentTarget.style.background = '#FAFAFA'}
          >
            <Minus size={14} />
          </button>
          <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700, color: '#222222', fontSize: '0.9rem' }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            style={{ width: '34px', height: '34px', border: 'none', background: '#FAFAFA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6B6B', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F0F0'}
            onMouseLeave={e => e.currentTarget.style.background = '#FAFAFA'}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2A44' }}>${item.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
