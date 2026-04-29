import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react"; // Added Eye
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useQuickViewStore } from "../stores/useQuickViewStore"; // Import Store
import { useState } from "react";
import { formatPrice } from "../utils/helpers";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { openQuickView } = useQuickViewStore(); // Get global trigger
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please login to add products to cart"); return; }
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please login to add to wishlist"); return; }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      className="card h-100"
      style={{
        backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0',
        borderRadius: '12px', overflow: 'hidden', width: '100%',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', position: 'relative'
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      {/* IMAGE SECTION */}
      <div className="position-relative overflow-hidden" style={{ height: '220px', backgroundColor: '#FAFAFA' }}>
        <img
          className="w-100 h-100"
          src={product.image}
          alt={product.name}
          style={{ objectFit: 'contain', transition: 'transform 0.5s ease', cursor: 'pointer' }}
          onClick={() => openQuickView(product)} // OPEN ON IMAGE CLICK
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Quick View Trigger (The Eye) */}
        <button
          onClick={(e) => { e.stopPropagation(); openQuickView(product); }}
          style={{
            position: 'absolute', bottom: '10px', right: '10px',
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: '#FFFFFF', border: 'none', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)', cursor: 'pointer', zIndex: 10
          }}
        >
          <Eye size={18} style={{ color: '#1F2A44' }} />
        </button>

        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          backgroundColor: '#C97C5D', color: '#FFFFFF',
          fontSize: '10px', fontWeight: 700, padding: '3px 10px',
          borderRadius: '999px', textTransform: 'uppercase'
        }}>
          New
        </span>

        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: isWishlisted ? '#C97C5D' : '#FFFFFF',
            border: '1px solid #E0E0E0', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Heart size={14} style={{ color: isWishlisted ? '#FFFFFF' : '#6B6B6B' }} fill={isWishlisted ? '#FFFFFF' : 'none'} />
        </button>
      </div>

      {/* BODY SECTION */}
      <div className="card-body d-flex flex-column p-3">
        <div className="mb-2">
          <small style={{ fontSize: '10px', fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase' }}>
            {product.category}
          </small>
          <h6 
            onClick={() => openQuickView(product)} // OPEN ON TITLE CLICK
            className="line-clamp-1" 
            style={{ fontWeight: 700, color: '#222222', marginTop: '4px', cursor: 'pointer' }}
          >
            {product.name}
          </h6>
        </div>

        <div className="d-flex gap-1 mb-2">
          {[...Array(4)].map((_, i) => <Star key={i} size={12} style={{ color: '#C97C5D' }} fill="#C97C5D" />)}
          <Star size={12} style={{ color: '#E0E0E0' }} fill="#E0E0E0" />
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2A44' }}>
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px',
              backgroundColor: '#C97C5D', border: 'none', color: '#FFFFFF',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;