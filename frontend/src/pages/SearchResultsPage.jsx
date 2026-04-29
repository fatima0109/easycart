import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

const SearchResultsPage = () => {
  const { fetchFilteredProducts, products, loading } = useProductStore();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search");
    const category = queryParams.get("category");
    fetchFilteredProducts({ search, category });
  }, [location.search, fetchFilteredProducts]);

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">

        {/* Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-1">
            <Search size={20} style={{ color: '#C97C5D' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2A44', marginBottom: 0 }}>Search Results</h1>
          </div>
          {searchTerm && (
            <p style={{ color: '#6B6B6B', fontSize: '0.9rem', marginBottom: 0 }}>
              Showing results for <strong style={{ color: '#222222' }}>"{searchTerm}"</strong>
              {!loading && <span> — {products.length} item{products.length !== 1 ? 's' : ''} found</span>}
            </p>
          )}
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <div>
              <div className="spinner-border mb-3" style={{ color: '#C97C5D', width: '2.5rem', height: '2.5rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ color: '#6B6B6B', textAlign: 'center', fontSize: '0.85rem' }}>Finding products...</p>
            </div>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {products.map((product) => (
                  <div key={product._id} className="col d-flex">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2A44', marginBottom: '0.5rem' }}>No results found</h2>
                <p style={{ color: '#6B6B6B', marginBottom: '1.5rem' }}>
                  Try different keywords or browse our categories.
                </p>
                <Link
                  to="/"
                  style={{
                    backgroundColor: '#1F2A44', color: '#FFFFFF',
                    padding: '10px 28px', borderRadius: '8px',
                    fontWeight: 700, textDecoration: 'none'
                  }}
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
