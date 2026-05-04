import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
// 1. Import your user store
import { useUserStore } from '../stores/useUserStore'; 

const PersonalInfo = () => {
  // 2. Access the logged-in user from the store
  const { user } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  
  // 3. Initialize local state with user data from the store
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "Not provided", // Default if not in your schema yet
    address: user?.address || "Not provided"
  });

  // Update form if user data changes (e.g., after a refresh)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "Not provided",
        address: user.address || "Not provided"
      });
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2A44', margin: 0 }}>
          Personal Information
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-sm d-flex align-items-center gap-2"
          style={{ border: '1px solid #E0E0E0', fontWeight: 600, color: '#1F2A44' }}
        >
          <Edit2 size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="row g-4">
        {/* Full Name */}
        <div className="col-md-6">
          <label className="small text-muted mb-1 fw-semibold">Full Name</label>
          <div className="position-relative">
            <User size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
            <input
              type="text"
              className="form-control"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={inputStyle(isEditing)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="small text-muted mb-1 fw-semibold">Email Address</label>
          <div className="position-relative">
            <Mail size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
            <input
              type="email"
              className="form-control"
              disabled={true} // Email is usually unique and not directly editable
              value={formData.email}
              style={inputStyle(false)}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="small text-muted mb-1 fw-semibold">Phone Number</label>
          <div className="position-relative">
            <Phone size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
            <input
              type="text"
              className="form-control"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={inputStyle(isEditing)}
            />
          </div>
        </div>

        {/* Address */}
        <div className="col-md-6">
          <label className="small text-muted mb-1 fw-semibold">Shipping Address</label>
          <div className="position-relative">
            <MapPin size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
            <input
              type="text"
              className="form-control"
              disabled={!isEditing}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={inputStyle(isEditing)}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4">
          <button 
            className="btn px-4 py-2 text-white"
            style={{ backgroundColor: '#1F2A44', borderRadius: '8px', fontWeight: 600 }}
            onClick={() => {
                alert("This would call your backend to update the user!");
                setIsEditing(false);
            }}
          >
            Save Changes
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper style function to keep code clean
const inputStyle = (isEditing) => ({
    paddingLeft: '40px',
    borderRadius: '8px',
    backgroundColor: isEditing ? '#fff' : '#F9FAFB',
    border: isEditing ? '1px solid #1F2A44' : '1px solid #E0E0E0',
    fontSize: '0.9rem'
});

export default PersonalInfo;