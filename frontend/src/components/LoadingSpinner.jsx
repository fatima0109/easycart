import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F5F3EF', zIndex: 9999
    }}>
      {/* Logo mark */}
      <motion.div
        style={{
          width: '52px', height: '52px', borderRadius: '14px',
          backgroundColor: '#1F2A44', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ color: '#C97C5D', fontWeight: 900, fontSize: '1.4rem', fontFamily: 'Poppins, sans-serif' }}>E</span>
      </motion.div>

      {/* Spinner ring */}
      <div style={{ position: 'relative', width: '44px', height: '44px', marginBottom: '1.25rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid #E0E0E0' }} />
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '44px', height: '44px', borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#C97C5D',
            borderRightColor: '#1F2A44'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.p
        style={{ color: '#9E9E9E', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Poppins, sans-serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Loading Collections...
      </motion.p>
      <div style={{ color: 'transparent' }} aria-live="polite">Loading, please wait...</div>
    </div>
  );
};

export default LoadingSpinner;
