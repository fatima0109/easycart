// frontend/src/pages/PurchaseCancelPage.jsx
import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * PurchaseCancelPage Component - Professional Formal Redesign
 * Uses Beige (#F5F3EF), White (#FFFFFF), and Copper (#C97C5D)
 */
const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F3EF]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E0E0E0]"
      >
        <div className="p-6 sm:p-8">
          {/* Cancel Icon with subtle red background (Error State) */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#D9534F]/10 rounded-full p-4">
              <XCircle className="text-[#D9534F] w-16 h-16" />
            </div>
          </div>

          {/* Heading (Error State Red) */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-[#D9534F] mb-3">
            Purchase Cancelled
          </h1>

          {/* Subtext (Primary Text) */}
          <p className="text-[#222222] text-center mb-6 font-medium">
            Your order has been cancelled. No charges have been made to your account.
          </p>

          {/* Info box (Beige Section) */}
          <div className="bg-[#FAFAFA] rounded-xl p-5 mb-8 border border-[#E0E0E0]">
            <p className="text-sm text-[#6B6B6B] text-center leading-relaxed">
              If you encountered any technical issues during the checkout process, please don&apos;t hesitate to
              reach out to our professional support team for assistance.
            </p>
          </div>

          {/* Return button (Copper Accent) */}
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#C97C5D] hover:bg-[#B96A4E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Return to Shop
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;