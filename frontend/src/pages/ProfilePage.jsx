import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, ShoppingBag, Settings, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: "/profile/me",       icon: User,        label: "My Profile"       },
  { to: "/profile/orders",   icon: ShoppingBag, label: "Order History"    },
  { to: "/profile/wishlist", icon: Heart,       label: "Wishlist"         },
  { to: "/profile/settings", icon: Settings,    label: "Account Settings" },
];

const ProfilePage = () => {
  return (
    /* INCREASED paddingTop TO 6rem TO CLEAR THE NAVIGATION BAR */
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container">
        <motion.h1
          style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2A44', marginBottom: '1.5rem' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Account
        </motion.h1>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card p-2" style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '14px' }}>
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '11px 16px', borderRadius: '8px', marginBottom: '4px',
                    fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none',
                    color: isActive ? '#FFFFFF' : '#222222',
                    backgroundColor: isActive ? '#1F2A44' : 'transparent',
                    transition: 'all 0.2s',
                  })}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            <motion.div
              className="card p-4 p-md-5"
              style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '14px', minHeight: '400px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;