// frontend/src/components/CategoryItem.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CategoryItem = ({ category }) => {
  return (
    <motion.div
      // We use a style object here to GUARANTEE the height is 400px
      style={{ 
        height: '400px', 
        width: '100%', 
        position: 'relative',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid #E0E0E0',
        backgroundColor: '#fff'
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Link to={"/category/" + category.href} style={{ display: 'block', height: '100%', width: '100%' }}>
        
        {/* THE IMAGE: Forced to fill the 400px container exactly */}
        <img
          src={category.imageUrl}
          alt={category.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // This prevents the 'big/small' height issue
            display: 'block'
          }}
          className="transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay - Navy */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(31, 42, 68, 0.95), rgba(31, 42, 68, 0.4), transparent)',
          zIndex: 1
        }} />

        {/* Content overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          zIndex: 10
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {category.name}
          </h3>
          
          <p style={{ color: '#e5e7eb', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Explore {category.name}
            <ArrowRight size={16} />
          </p>

          {/* Decorative Copper Underline */}
          <div style={{
            width: '40px',
            height: '4px',
            background: 'linear-gradient(to right, #C97C5D, #B96A4E)',
            borderRadius: '99px',
            marginTop: '0.75rem'
          }} />
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryItem;