import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2 } from 'lucide-react';

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  // Placeholder state - normally you'd fetch this from your backend/store
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, New York, NY"
  });

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
        {[
          { label: 'Full Name', key: 'fullName', icon: User },
          { label: 'Email Address', key: 'email', icon: Mail },
          { label: 'Phone Number', key: 'phone', icon: Phone },
          { label: 'Shipping Address', key: 'address', icon: MapPin },
        ].map((item) => (
          <div className="col-md-6" key={item.key}>
            <label className="small text-muted mb-1 fw-semibold">{item.label}</label>
            <div className="position-relative">
              <item.icon size={16} className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control"
                disabled={!isEditing}
                value={userData[item.key]}
                onChange={(e) => setUserData({...userData, [item.key]: e.target.value})}
                style={{
                  paddingLeft: '40px',
                  borderRadius: '8px',
                  backgroundColor: isEditing ? '#fff' : '#F9FAFB',
                  border: isEditing ? '1px solid #1F2A44' : '1px solid #E0E0E0'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4">
          <button 
            className="btn px-4 py-2 text-white"
            style={{ backgroundColor: '#1F2A44', borderRadius: '8px', fontWeight: 600 }}
            onClick={() => setIsEditing(false)}
          >
            Save Changes
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PersonalInfo;