import { useState, useEffect } from 'react';
import axios from 'axios';

const initialForm = {
  name: '',
  price: '',
  stockQuantity: '',
  category: '',
  imageURL: '',
  description: ''
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get('/api/products');
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (editing) {
      await axios.put(`/api/products/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('/api/products', form, { headers: { Authorization: `Bearer ${token}` } });
    }
    setEditing(null);
    setForm(initialForm);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchProducts();
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <input placeholder="Stock" type="number" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})} required />
        <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        <input placeholder="Image URL" value={form.imageURL} onChange={e => setForm({...form, imageURL: e.target.value})} required />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit">{editing ? 'Update' : 'Create'}</button>
        {editing && <button onClick={() => { setEditing(null); setForm(initialForm); }}>Cancel</button>}
      </form>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} - ${p.price}
            <button onClick={() => { setEditing(p._id); setForm(p); }}>Edit</button>
            <button onClick={() => deleteProduct(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}