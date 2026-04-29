import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({ users: 0, products: 0, totalSales: 0, totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) { 
        console.error("Error fetching analytics data:", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 p-md-5">
        <div className="row g-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-sm-6 col-xl-3">
              <div style={{ height: '100px', borderRadius: '12px', backgroundColor: '#F0F0F0', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
        <div style={{ height: '350px', borderRadius: '12px', backgroundColor: '#F0F0F0', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    );
  }

  const kpiCards = [
    { title: "Total Users",    value: analyticsData.users.toLocaleString(),                 icon: Users,        color: '#1F2A44' },
    { title: "Total Products", value: analyticsData.products.toLocaleString(),               icon: Package,      color: '#1F2A44' },
    { title: "Total Sales",    value: analyticsData.totalSales.toLocaleString(),             icon: ShoppingCart, color: '#C97C5D' },
    { title: "Total Revenue",  value: `$${analyticsData.totalRevenue.toLocaleString()}`,     icon: DollarSign,   color: '#C97C5D' },
  ];

  return (
    <div className="p-4 p-md-5">
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpiCards.map(({ title, value, icon: Icon, color }, i) => (
          <div key={title} className="col-sm-6 col-xl-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0',
                borderRadius: '12px', padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{title}</p>
                  <h3 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#1F2A44', marginBottom: 0 }}>{value}</h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} style={{ color }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: color, opacity: 0.3 }} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="d-flex align-items-center gap-2 mb-4">
          <div style={{ width: '4px', height: '22px', backgroundColor: '#C97C5D', borderRadius: '2px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#222222', marginBottom: 0 }}>Daily Sales & Revenue Trends</h3>
        </div>

        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            
            {/* dataKey is changed to "date" to match your backend aggregation */}
            <XAxis 
                dataKey="date" 
                stroke="#E0E0E0" 
                tick={{ fill: '#9E9E9E', fontSize: 12 }} 
                tickLine={false} 
            />

            <YAxis 
                yAxisId="left" 
                stroke="#E0E0E0" 
                tick={{ fill: '#9E9E9E', fontSize: 12 }} 
                tickLine={false} 
            />

            <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#E0E0E0" 
                tick={{ fill: '#9E9E9E', fontSize: 12 }} 
                tickLine={false} 
            />

            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '10px' }} />
            <Legend />

            <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="sales" 
                stroke="#C97C5D" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#C97C5D' }} 
                name="Sales" 
            />

            <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#1F2A44" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: '#1F2A44' }} 
                name="Revenue" 
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;