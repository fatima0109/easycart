import { ShoppingCart, LogOut, Menu, X, MapPin, ChevronDown, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  return (
  <>
    <header className="fixed-top bg-white" style={{ borderBottom: '1px solid #E0E0E0', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', zIndex: 1000 }}>

      {/* TOP STRIP */}
      <div style={{ backgroundColor: '#1F2A44', padding: '6px 0', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textAlign: 'center', letterSpacing: '0.06em' }}>
        ✦ FREE SHIPPING ON ORDERS OVER $200 ✦ EASY 30-DAY RETURNS ✦
      </div>

      {/* MAIN NAV ROW */}
      <div className="container-fluid px-3 py-2">
        <div className="row align-items-center g-2">

          {/* LEFT: Mobile Toggle + Logo */}
          <div className="col-auto d-flex align-items-center gap-3">
            <button
              className="d-lg-none btn p-1"
              style={{ border: 'none', background: 'none' }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} style={{ color: '#222222' }} />
            </button>

            <Link to="/" className="d-flex align-items-center text-decoration-none gap-2">
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px',
                backgroundColor: '#1F2A44', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
              }}>
                <span style={{ color: '#C97C5D', fontWeight: 900, fontSize: '1rem' }}>E</span>
              </div>
              <span className="d-none d-sm-inline" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1F2A44', letterSpacing: '-0.5px' }}>
                EasyCart
              </span>
            </Link>

            <div className="d-none d-xl-flex align-items-center gap-1" style={{ borderLeft: '1px solid #E0E0E0', paddingLeft: '1rem' }}>
              <MapPin size={16} style={{ color: '#C97C5D' }} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '10px', color: '#9E9E9E', fontWeight: 700, textTransform: 'uppercase' }}>Deliver to</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#222222' }}>Pakistan</div>
              </div>
            </div>
          </div>

          {/* CENTER: Search - CLEANED UP TO REMOVE DUPLICATES */}
          <div className="col flex-grow-1 px-md-4">
              <SearchBar />
          </div>

          {/* RIGHT: Actions */}
          <div className="col-auto d-flex align-items-center gap-2 gap-md-3">
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="d-none d-md-flex align-items-center gap-2 btn btn-dark btn-sm"
                style={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}
              >
                <Lock size={13} /> Admin
              </Link>
            )}

            <Link to={user ? "/profile" : "/login"} className="text-decoration-none d-flex flex-column" style={{ lineHeight: 1.3 }}>
              <span style={{ fontSize: '11px', color: '#9E9E9E', fontWeight: 500 }} className="d-none d-md-block">
                Hello, {user ? user.name.split(" ")[0] : "Sign in"}
              </span>
              <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#222222' }}>
                <User size={14} />
                Account <ChevronDown size={13} />
              </span>
            </Link>

            {user && (
              <button
                onClick={logout}
                className="d-none d-md-flex align-items-center gap-1 btn btn-sm"
                style={{ color: '#6B6B6B', border: 'none', background: 'none', fontSize: '0.8rem', fontWeight: 600 }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            )}

            <Link to="/cart" className="position-relative p-2 text-decoration-none" style={{ color: '#222222' }}>
              <ShoppingCart size={22} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ backgroundColor: '#C97C5D', fontSize: '10px', minWidth: '18px', lineHeight: '18px', padding: '0 5px' }}
              >
                {Array.isArray(cart) ? cart.length : 0}
              </span>
            </Link>
          </div>

        </div>
      </div>

      {/* SUB-NAV */}
      <div className="d-none d-md-block" style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid #E0E0E0' }}>
        <div className="container">
          <nav className="d-flex gap-4 py-2" style={{ fontSize: '0.8rem' }}>
            {[
              { to: '/info/about',    label: 'About Us'  },
              { to: '/info/faq',      label: 'FAQ'       },
              { to: '/info/shipping', label: 'Shipping'  },
              { to: '/info/returns',  label: 'Returns'   },
              { to: '/info/contact',  label: 'Contact'   },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-decoration-none nav-link p-0"
                style={{ color: '#6B6B6B', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#1F2A44'}
                onMouseLeave={e => e.target.style.color = '#6B6B6B'}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1050 }}
            />
            <motion.div
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.25 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px',
                backgroundColor: '#FFFFFF', zIndex: 1060, overflowY: 'auto',
                boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ padding: '1.25rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1F2A44' }}>Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                    <X size={22} style={{ color: '#6B6B6B' }} />
                  </button>
                </div>

                {user && (
                  <div style={{ padding: '12px 14px', backgroundColor: '#F5F3EF', borderRadius: '10px', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9E9E9E', marginBottom: 2 }}>Signed in as</p>
                    <p style={{ fontWeight: 700, color: '#1F2A44', marginBottom: 0 }}>{user.name}</p>
                  </div>
                )}

                <SearchBar onClose={() => setIsMobileMenuOpen(false)} />

                <div className="d-flex flex-column gap-2 mt-3">
                  {[
                    { to: '/',              label: 'Home'     },
                    { to: '/info/about',    label: 'About Us' },
                    { to: '/info/faq',      label: 'FAQ'      },
                    { to: '/info/shipping', label: 'Shipping' },
                    { to: '/info/returns',  label: 'Returns'  },
                    { to: '/info/contact',  label: 'Contact'  },
                    ...(user     ? [{ to: '/profile', label: 'My Account' }] : []),
                    ...(isAdmin  ? [{ to: '/secret-dashboard', label: 'Admin Dashboard' }] : []),
                    ...(!user    ? [{ to: '/login',  label: 'Sign In'   }, { to: '/signup', label: 'Register' }] : []),
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'block', padding: '10px 14px', borderRadius: '8px',
                        color: '#222222', fontWeight: 600, textDecoration: 'none',
                        fontSize: '0.9rem', transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {label}
                    </Link>
                  ))}
                  {user && (
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      style={{
                        display: 'block', width: '100%', padding: '10px 14px',
                        borderRadius: '8px', border: 'none', background: 'none',
                        color: '#D9534F', fontWeight: 700, textAlign: 'left',
                        fontSize: '0.9rem', cursor: 'pointer'
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>

    {/* --- CONTENT SPACER --- */}
      {/* This pushes the "Admin Dashboard" and other page content down so it doesn't hide behind the navbar */}
      <div className="d-none d-md-block" style={{ height: '100px' }}></div>
      <div className="d-md-none" style={{ height: '85px' }}></div>
  </>
      
  );
};

export default Navbar;
