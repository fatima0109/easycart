import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, ShieldCheck, Trash2 } from 'lucide-react';

const AccountSettings = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2A44' }}>
        Account Settings
      </h2>

      {/* Change Password Section */}
      <section className="mb-5">
        <h3 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
          <Lock size={18} /> Security
        </h3>
        <div className="card p-3" style={{ border: '1px solid #E0E0E0', borderRadius: '10px' }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="small fw-semibold">Current Password</label>
              <input type="password" placeholder="••••••••" className="form-control" style={{ borderRadius: '8px' }} />
            </div>
            <div className="col-md-6">
              <label className="small fw-semibold">New Password</label>
              <input type="password" placeholder="New Password" className="form-control" style={{ borderRadius: '8px' }} />
            </div>
            <div className="col-12 mt-3">
              <button className="btn btn-dark btn-sm px-3" style={{ borderRadius: '6px' }}>Update Password</button>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-5">
        <h3 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
          <Bell size={18} /> Notifications
        </h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
            <div>
              <div className="fw-semibold">Email Notifications</div>
              <div className="small text-muted">Receive updates about your orders and offers.</div>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" defaultChecked />
            </div>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
            <div>
              <div className="fw-semibold">SMS Alerts</div>
              <div className="small text-muted">Get shipping status via text message.</div>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" />
            </div>
          </li>
        </ul>
      </section>

      {/* Danger Zone */}
      <section>
        <h3 className="h6 fw-bold mb-3 text-danger d-flex align-items-center gap-2">
          <ShieldCheck size={18} /> Danger Zone
        </h3>
        <div className="card border-danger-subtle bg-danger-subtle bg-opacity-10 p-3" style={{ borderRadius: '10px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold text-danger">Delete Account</div>
              <div className="small text-muted">Once you delete your account, there is no going back.</div>
            </div>
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
              <Trash2 size={14} /> Deactivate
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AccountSettings;