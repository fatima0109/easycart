import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Star, Eye, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useQuickViewStore } from "../stores/useQuickViewStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { openQuickView } = useQuickViewStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setItemsPerPage(1);
      else if (window.innerWidth < 992) setItemsPerPage(2);
      else if (window.innerWidth < 1200) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => prev + itemsPerPage);
  const prevSlide = () => setCurrentIndex((prev) => prev - itemsPerPage);

  const productsArray = Array.isArray(featuredProducts) ? featuredProducts : [];
  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= productsArray.length - itemsPerPage;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-[#1F2A44]">Featured Products</h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#C97C5D', margin: '15px auto' }}></div>
        </div>

        <div className="position-relative">
          <div className="overflow-hidden">
            <div
              className="d-flex transition-all"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {productsArray.map((product) => (
                <div 
                  key={product._id} 
                  className="px-2 flex-shrink-0"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className="card h-100" style={{
                    backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0',
                    borderRadius: '12px', overflow: 'hidden',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', position: 'relative'
                  }}>
                    
                    {/* IMAGE SECTION */}
                    <div className="position-relative overflow-hidden" style={{ height: '240px', backgroundColor: '#FAFAFA' }}>
                      <img
                        src={product.image}
                        className="w-100 h-100"
                        alt={product.name}
                        style={{ objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.5s ease' }}
                        onClick={() => openQuickView(product)}
                      />
                      
                      {/* Top Left: New Badge */}
                      <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        backgroundColor: '#C97C5D', color: '#FFFFFF',
                        fontSize: '10px', fontWeight: 700, padding: '3px 12px',
                        borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        New
                      </span>

                      {/* Top Right: Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if(!user) return toast.error("Please login to use wishlist");
                          toast.success("Added to wishlist");
                        }}
                        style={{
                          position: 'absolute', top: '12px', right: '12px',
                          width: '34px', height: '34px', borderRadius: '50%',
                          backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', zIndex: 5
                        }}
                      >
                        <Heart size={16} style={{ color: '#6B6B6B' }} />
                      </button>

                      {/* Bottom Right: Quick View Button (The Eye) */}
                      <button
                        onClick={(e) => { e.stopPropagation(); openQuickView(product); }}
                        style={{
                          position: 'absolute', bottom: '12px', right: '12px',
                          width: '38px', height: '38px', borderRadius: '50%',
                          backgroundColor: '#FFFFFF', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)', cursor: 'pointer', zIndex: 5
                        }}
                      >
                        <Eye size={18} style={{ color: '#1F2A44' }} />
                      </button>
                    </div>

                    {/* CARD BODY */}
                    <div className="card-body d-flex flex-column p-3">
                      <div className="mb-2">
                        <small style={{ fontSize: '10px', fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {product.category || "Fashion"}
                        </small>
                        <h6 
                          onClick={() => openQuickView(product)}
                          className="line-clamp-1" 
                          style={{ fontWeight: 700, color: '#222222', marginTop: '4px', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          {product.name}
                        </h6>
                      </div>

                      {/* Stars */}
                      <div className="d-flex gap-1 mb-2">
                        {[...Array(4)].map((_, i) => <Star key={i} size={13} style={{ color: '#C97C5D' }} fill="#C97C5D" />)}
                        <Star size={13} style={{ color: '#E0E0E0' }} fill="#E0E0E0" />
                      </div>

                      <div className="mt-auto">
                        <h5 className="fw-bold text-[#1F2A44] mb-3">${product.price.toFixed(2)}</h5>

                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="btn w-100 py-2 fw-bold text-white shadow-sm"
                          style={{ 
                            backgroundColor: '#C97C5D', border: 'none', 
                            borderRadius: '8px', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', gap: '8px' 
                          }}
                        >
                          <ShoppingCart size={18} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide} 
            disabled={isStartDisabled} 
            className="btn btn-dark position-absolute top-50 start-0 translate-middle rounded-circle shadow-lg d-none d-md-flex align-items-center justify-content-center"
            style={{ zIndex: 10, width: '45px', height: '45px', backgroundColor: '#1F2A44', border: 'none', display: isStartDisabled ? 'none' : 'flex' }}
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={nextSlide} 
            disabled={isEndDisabled} 
            className="btn btn-dark position-absolute top-50 start-100 translate-middle rounded-circle shadow-lg d-none d-md-flex align-items-center justify-content-center"
            style={{ zIndex: 10, width: '45px', height: '45px', backgroundColor: '#1F2A44', border: 'none', display: isEndDisabled ? 'none' : 'flex' }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;