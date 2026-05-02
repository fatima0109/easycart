import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setIsSubscribing(true);
    setTimeout(() => {
      toast.success("Successfully subscribed!");
      setEmail(""); setIsSubscribing(false);
    }, 500);
  };

  const linkStyle = {
    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
    fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s',
    display: 'inline-block'
  };

  return (
    <footer style={{ backgroundColor: '#1F2A44', color: 'rgba(255,255,255,0.7)' }}>
      <div className="container py-5">
        <div className="row g-5">

          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ width: '36px', height: '36px', backgroundColor: '#C97C5D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.1rem' }}>E</span>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>EasyCart</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', maxWidth: '280px' }}>
              Elevating everyday living through curated excellence. Premium quality products, delivered with care.
            </p>
            {/* Social Media icons removed from here */}
          </div>

          {/* Shop Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Shop
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { to: '/category/fashion',    label: 'Fashion'     },
                { to: '/category/jewellery',  label: 'Jewellery'   },
                { to: '/category/gaming',     label: 'Gaming'      },
                { to: '/category/kitchen',    label: 'Kitchen'     },
                { to: '/category/electronics',       label: 'Electronics'        },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} style={linkStyle}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Help
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { to: '/info/faq',      label: 'FAQ'       },
                { to: '/info/shipping', label: 'Shipping'  },
                { to: '/info/returns',  label: 'Returns'   },
                { to: '/info/contact',  label: 'Contact'   },
                { to: '/info/about',    label: 'About Us'  },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} style={linkStyle}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Stay Updated
            </h6>
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1rem' }}>
              Subscribe to get exclusive deals and new arrivals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF', borderRadius: '8px', fontSize: '0.85rem'
                }}
              />
              <button
                type="submit"
                disabled={isSubscribing}
                style={{
                  backgroundColor: '#C97C5D', border: 'none', color: '#FFFFFF',
                  padding: '0 20px', borderRadius: '8px', fontWeight: 700,
                  fontSize: '0.82rem', whiteSpace: 'nowrap', cursor: 'pointer',
                  transition: 'background 0.2s', flexShrink: 0
                }}
              >
                {isSubscribing ? '...' : 'Subscribe'}
              </button>
            </form>

            <div className="d-flex flex-column gap-2 mt-4">
              {[
                { icon: Phone,  text: '+1 (555) 123-4567' },
                { icon: Mail,   text: 'support@easycart.com' },
                { icon: MapPin, text: '123 Commerce St, NY' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                  <Icon size={14} style={{ color: '#C97C5D', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 0 }}>
            © {new Date().getFullYear()} EasyCart Corporation. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            <Link to="/info/terms"   style={{ ...linkStyle, fontSize: '0.78rem' }}>Terms</Link>
            <Link to="/info/privacy" style={{ ...linkStyle, fontSize: '0.78rem' }}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;