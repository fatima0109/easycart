import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X, Package } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  { id: "jewellery", label: "Jewellery" },
  { id: "gaming", label: "Gaming Setup" },
  { id: "kitchen", label: "Kitchen Essentials" },
  { id: "fashion", label: "Modern Fashion" },
  { id: "appliances", label: "Home Appliances" },
  { id: "electronics", label: "Electronics" }
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", image: "" });
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
    } catch (error) { console.log(error); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const labelStyle = { fontSize: '0.75rem', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 p-md-5"
    >
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(201,124,93,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={20} style={{ color: '#C97C5D' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F2A44', marginBottom: 0 }}>Add New Product</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B6B6B', marginBottom: 0 }}>Fill in the details below to list a product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* Product Name */}
          <div className="col-12">
            <label style={labelStyle}>Product Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Premium Leather Bag"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
              style={{ padding: '11px 14px' }}
            />
          </div>

          {/* Description */}
          <div className="col-12">
            <label style={labelStyle}>Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe the product..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
              style={{ padding: '11px 14px', resize: 'none' }}
            />
          </div>

          {/* Price + Category */}
          <div className="col-md-6">
            <label style={labelStyle}>Price (USD)</label>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0', borderRight: 'none', color: '#6B6B6B', fontWeight: 700 }}>$</span>
              <input
                type="number"
                className="form-control"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                style={{ padding: '11px 14px', borderLeft: 'none' }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label style={labelStyle}>Category</label>
            <select
  className="form-select"
  value={newProduct.category}
  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
  required
  style={{ padding: '11px 14px' }}
>
  <option value="">Select category...</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.label}
    </option>
  ))}
</select>
          </div>

          {/* Image Upload */}
          <div className="col-12">
            <label style={labelStyle}>Product Image</label>
            <div className="d-flex align-items-center gap-3">
              <input type="file" id="image" className="d-none" accept="image/*" onChange={handleImageChange} />
              <label htmlFor="image" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px',
                border: '2px dashed #E0E0E0', backgroundColor: '#FAFAFA',
                color: '#6B6B6B', fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <Upload size={16} style={{ color: '#C97C5D' }} /> Upload Image
              </label>
              {newProduct.image && (
                <div className="position-relative">
                  <img src={newProduct.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E0E0E0' }} />
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, image: '' })}
                    style={{
                      position: 'absolute', top: '-8px', right: '-8px',
                      width: '22px', height: '22px', borderRadius: '50%',
                      backgroundColor: '#D9534F', border: 'none', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="col-12 mt-2">
            <hr style={{ borderColor: '#E0E0E0', margin: '0.5rem 0 1.25rem' }} />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '10px',
                backgroundColor: loading ? '#D3D3D3' : '#C97C5D',
                border: 'none', color: loading ? '#888888' : '#FFFFFF',
                fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'background 0.2s'
              }}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <PlusCircle size={18} />}
              {loading ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
