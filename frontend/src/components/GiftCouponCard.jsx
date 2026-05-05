// frontend/src/components/GiftCouponCard.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Ticket, Trash2, CheckCircle, Gift } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

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
      // ADDED 'relative' and 'z-[1]' here 👇
      className="relative z-[1] space-y-5 rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Coupon Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-[#C97C5D]" />
          <label htmlFor="voucher" className="block text-sm font-bold text-[#222222]">
            Have a voucher or gift card?
          </label>
        </div>
        
        {/* Input and Button Container */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            id="voucher"
            className="w-full rounded-lg border border-[#E0E0E0] bg-white p-3 text-sm text-[#222222] focus:border-[#C97C5D] outline-none transition-all"
            placeholder="Enter promo code (e.g., SAVE20)"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
          />
          
          <motion.button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-lg py-3 px-6 text-sm font-bold text-white shadow-md border-0 transition-all"
            style={{ backgroundColor: '#C97C5D' }} // FORCING COPPER COLOR
            whileHover={{ backgroundColor: '#B96A4E' }}
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
            <button
              type="button"
              className="p-2 text-[#D9534F] hover:bg-[#D9534F]/10 rounded-lg transition-colors"
              onClick={handleRemoveCoupon}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* --- HARDCODED AVAILABLE REWARD --- */}
      {!isCouponApplied && (
        <div className="mt-2 rounded-xl border border-[#E0E0E0] bg-[#F5F3EF] p-4">
          <div className="flex items-start gap-3">
            <Ticket className="h-5 w-5 text-[#1F2A44] mt-0.5" />
            <div>
              <h3 className="font-bold text-[#1F2A44] text-sm">Available Reward</h3>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Code: <span className="font-bold text-[#C97C5D]">GIFTK8SDS7</span> (10% discount)
              </p>
              <p className="text-[10px] text-[#9E9E9E] mt-1 italic">Copy and paste this code above to save.</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;