import { BarChart, PlusCircle, ShoppingBasket, Package } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "analytics", label: "Analytics",      icon: BarChart,      path: "/secret-dashboard/analytics" },
  { id: "create",    label: "Create Product",  icon: PlusCircle,    path: "/secret-dashboard/create"    },
  { id: "products",  label: "Products",        icon: ShoppingBasket,path: "/secret-dashboard/products"  },
  { id: "orders",    label: "Orders",          icon: Package,       path: "/secret-dashboard/orders"    },
];

const AdminPage = () => {
  const { fetchAllProducts } = useProductStore();
  const location = useLocation();

  useEffect(() => { fetchAllProducts(); }, [fetchAllProducts]);

  return (
    /* INCREASED paddingTop TO 6rem TO CLEAR THE NAVIGATION BAR */
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          className="d-flex align-items-center gap-3 mb-4"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart size={22} style={{ color: '#C97C5D' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2A44', marginBottom: 0 }}>Admin Dashboard</h1>
            <p style={{ color: '#6B6B6B', fontSize: '0.8rem', marginBottom: 0 }}>Manage your store from one place</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="d-flex justify-content-center mb-4">
          <div className="d-flex gap-2 p-2" style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0',
            borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            overflowX: 'auto', flexWrap: 'nowrap'
          }}>
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 20px', borderRadius: '8px',
                    fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                    backgroundColor: isActive ? '#1F2A44' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#6B6B6B',
                    boxShadow: isActive ? '0 2px 8px rgba(31,42,68,0.25)' : 'none'
                  }}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <motion.div
          style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0',
            borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            minHeight: '500px', overflow: 'hidden'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;