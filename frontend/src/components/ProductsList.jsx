import { motion } from "framer-motion";
import { Trash, Star, Package } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4"
    >
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F2A44', marginBottom: '1.5rem' }}>
        All Products <span style={{ fontSize: '0.85rem', color: '#9E9E9E', fontWeight: 500 }}>({products?.length || 0} items)</span>
      </h2>
      <div className="table-responsive" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0E0E0' }}>
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr style={{ backgroundColor: '#1F2A44' }}>
              {['Product', 'Price', 'Category', 'Featured', 'Actions'].map((h, i) => (
                <th key={h} style={{
                  color: '#FFFFFF', fontWeight: 700, fontSize: '0.72rem',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: '14px 20px', border: 'none', backgroundColor: '#1F2A44',
                  textAlign: i === 4 ? 'right' : 'left'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#FFFFFF' }}>
            {products?.map((product) => (
              <motion.tr
                key={product._id}
                style={{ borderBottom: '1px solid #F0F0F0' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E0E0E0' }}
                    />
                    <span style={{ fontWeight: 700, color: '#222222', fontSize: '0.9rem' }}>{product.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 800, color: '#1F2A44' }}>
                  ${product.price.toFixed(2)}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    backgroundColor: 'rgba(31,42,68,0.08)', color: '#1F2A44',
                    padding: '4px 12px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    style={{
                      width: '34px', height: '34px', borderRadius: '8px',
                      border: 'none', cursor: 'pointer',
                      backgroundColor: product.isFeatured ? '#C97C5D' : '#F0F0F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Star size={15} fill={product.isFeatured ? "#FFFFFF" : "none"} style={{ color: product.isFeatured ? '#FFFFFF' : '#9E9E9E' }} />
                  </button>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    style={{
                      width: '34px', height: '34px', borderRadius: '8px',
                      border: '1px solid rgba(217,83,79,0.2)', cursor: 'pointer',
                      backgroundColor: 'rgba(217,83,79,0.07)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', color: '#D9534F'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(217,83,79,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(217,83,79,0.07)'}
                  >
                    <Trash size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsList;
