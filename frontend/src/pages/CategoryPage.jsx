import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { Package } from "lucide-react";

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(201,124,93,0.12)', color: '#C97C5D',
            padding: '4px 16px', borderRadius: '999px',
            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: '0.75rem'
          }}>
            Browse Collection
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1F2A44', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <div style={{ width: '50px', height: '3px', backgroundColor: '#C97C5D', borderRadius: '2px', margin: '0 auto' }}></div>
        </motion.div>

        {/* Grid */}
        {products?.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(201,124,93,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Package size={30} style={{ color: '#C97C5D' }} />
            </div>
            <h4 style={{ fontWeight: 700, color: '#1F2A44', marginBottom: '0.5rem' }}>No products yet</h4>
            <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>No products found in this category.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products?.map((product, i) => (
              <motion.div
                key={product._id}
                className="col d-flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
