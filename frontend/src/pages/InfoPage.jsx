import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

const InfoPage = () => {
  const { type } = useParams();

  const content = {
    about:   { title: "About Us",                  icon: "🏪", text: "We are EasyCart, your number one source for all things quality. Founded with a passion for premium products, we curate the finest items across jewellery, gaming, fashion, and home essentials. Our mission is to elevate everyday living by connecting you with products that combine style, functionality, and exceptional value." },
    contact: { title: "Contact Us",                icon: "📬", text: "Email us at support@easycart.com or call 1-800-EASY. Our dedicated customer support team is available Monday–Friday, 9AM–6PM EST. We typically respond to all inquiries within 24 hours. For urgent matters, please call our hotline." },
    terms:   { title: "Terms of Service",          icon: "📄", text: "By using our site, you agree to our terms and conditions. All purchases are subject to our standard return policy. We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of any changes made." },
    privacy: { title: "Privacy Policy",            icon: "🔒", text: "Your data is safe with us. We do not sell your personal information to third parties. We use industry-standard encryption to protect your data. Information collected is used solely to improve your shopping experience and process your orders." },
    faq:     { title: "Frequently Asked Questions",icon: "❓", text: "How long is shipping? Usually 3-5 business days. Can I return an item? Yes, within 30 days of purchase. Do you offer international shipping? Yes, we ship to over 50 countries. How can I track my order? A tracking link is sent to your email upon dispatch." },
    shipping: { title: "Shipping Policy",          icon: "🚚", text: "We ship worldwide using eco-friendly packaging. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Orders over $200 qualify for free standard shipping. International orders may take 7-14 days." },
    returns:  { title: "Return Policy",            icon: "↩️", text: "30-day money-back guarantee on all items. Items must be in their original condition and packaging. To initiate a return, contact our support team with your order number. Refunds are processed within 5-7 business days of receiving the returned item." }
  };

  const page = content[type] || { title: "Page Not Found", icon: "⚠️", text: "Sorry, that page doesn't exist. Please navigate back to our homepage." };

  return (
    <div style={{ backgroundColor: '#F5F3EF', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '760px' }}>

        {/* Breadcrumb */}
        <nav className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.82rem', color: '#6B6B6B' }}>
          <Link to="/" style={{ color: '#6B6B6B', textDecoration: 'none' }} className="d-flex align-items-center gap-1">
            <Home size={14} /> Home
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#1F2A44', fontWeight: 600 }}>{page.title}</span>
        </nav>

        {/* Card */}
        <motion.div
          className="card p-4 p-md-5"
          style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon + Title */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{page.icon}</div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2A44', marginBottom: 0 }}>{page.title}</h1>
              <div style={{ width: '40px', height: '3px', backgroundColor: '#C97C5D', borderRadius: '2px', marginTop: '6px' }}></div>
            </div>
          </div>

          {/* Divider */}
          <hr style={{ borderColor: '#E0E0E0', margin: '1.5rem 0' }} />

          {/* Content */}
          <p style={{ color: '#6B6B6B', lineHeight: 1.9, fontSize: '0.95rem' }}>{page.text}</p>

          {/* Back Button */}
          <div className="mt-4 pt-2">
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#1F2A44', color: '#FFFFFF',
                padding: '10px 24px', borderRadius: '8px',
                fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                transition: 'background 0.2s'
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default InfoPage;
