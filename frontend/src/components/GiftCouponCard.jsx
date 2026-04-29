// frontend/src/components/GiftCouponCard.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Ticket, Trash2, CheckCircle, Gift } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

/**
 * GiftCouponCard Component - Professional Formal Redesign
 * Uses Navy (#1F2A44), Beige (#F5F3EF), and Copper (#C97C5D)
 */
const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="space-y-5 rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm sm:p-6 transition-all duration-300 hover:shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Coupon Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-[#C97C5D]" />
          <label htmlFor="voucher" className="block text-sm font-bold text-[#222222]">
            Have a voucher or gift card?
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            id="voucher"
            className="flex-1 rounded-lg border border-[#E0E0E0] bg-white p-3 text-sm text-[#222222] placeholder-[#9E9E9E] focus:border-[#C97C5D] focus:ring-2 focus:ring-[#C97C5D]/20 transition-all duration-200"
            placeholder="Enter promo code (e.g., SAVE20)"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
          />
          <motion.button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C97C5D] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#B96A4E] focus:outline-none focus:ring-2 focus:ring-[#C97C5D] transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApplyCoupon}
          >
            <Ticket className="h-4 w-4" />
            Apply Code
          </motion.button>
        </div>
      </div>

      {/* Applied Coupon Info (Success State) */}
      {isCouponApplied && coupon && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 rounded-xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#4CAF50] mt-0.5" />
              <div>
                <h3 className="font-bold text-[#222222]">Applied Coupon</h3>
                <p className="text-sm text-[#4CAF50] font-semibold mt-1">
                  {coupon.code} – {coupon.discountPercentage}% off applied
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              className="rounded-lg bg-[#D9534F]/10 p-2 text-[#D9534F] hover:bg-[#D9534F]/20 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveCoupon}
              aria-label="Remove coupon"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* User's Available Coupon (Beige Background) */}
      {coupon && !isCouponApplied && (
        <div className="mt-4 rounded-xl border border-[#E0E0E0] bg-[#F5F3EF] p-4">
          <div className="flex items-start gap-3">
            <Ticket className="h-5 w-5 text-[#1F2A44] mt-0.5" />
            <div>
              <h3 className="font-bold text-[#1F2A44]">Available Reward</h3>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Code: <span className="font-bold text-[#222222]">{coupon.code}</span> ({coupon.discountPercentage}% discount)
              </p>
              <p className="text-xs text-[#9E9E9E] mt-2 italic">Apply this code at checkout to save on your order.</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;