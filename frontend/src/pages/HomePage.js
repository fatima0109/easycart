import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const url = category ? `/api/products?category=${category}` : '/api/products';
    axios.get(url).then(res => setProducts(res.data));
  }, [category]);

  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
      </select>
      <div className="grid">
        {products.map(p => (
          <div key={p._id}>
            <img src={p.imageURL} alt={p.name} width="150" />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}