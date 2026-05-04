// frontend/src/components/CategoryItem.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryItem = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }} // Ensure cards in a row have equal height
    >
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        height: '420px', // Uniform height
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #f0f0f0',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      className="category-card-hover"
      >
        {/* Title Section */}
        <h3 style={{ 
          color: '#1F2A44', 
          fontSize: '1.25rem', 
          fontWeight: 800, 
          marginBottom: '1rem',
          letterSpacing: '-0.2px',
          minHeight: '3rem', // Keeps alignment if title wraps
          lineHeight: '1.2'
        }}>
          {category.name}
        </h3>

        {/* Main Image Container */}
        <Link 
          to={"/category/" + category.href} 
          style={{ 
            flex: 1, 
            overflow: 'hidden', 
            borderRadius: '4px',
            backgroundColor: '#F9F9F9', // Light grey for product background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            textDecoration: 'none'
          }}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={category.imageUrl}
            alt={category.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Change to 'contain' if you want white margins around products
            }}
          />
        </Link>

        {/* Footer Section */}
        <div style={{ marginTop: 'auto' }}>
          <Link 
            to={"/category/" + category.href} 
            style={{ 
              color: '#C97C5D', // Your brand copper color
              fontSize: '0.9rem', 
              fontWeight: 700, 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Explore {category.name}
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </Link>
          
          {/* Subtle accent bar */}
          <div style={{ 
            width: '30px', 
            height: '2px', 
            backgroundColor: '#C97C5D', 
            marginTop: '4px',
            opacity: 0.4 
          }}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryItem;