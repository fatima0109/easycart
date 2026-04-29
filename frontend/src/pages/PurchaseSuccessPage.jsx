import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen flex items-center justify-center px-4 bg-[#F5F3EF] relative overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#4CAF50]/20 relative z-10'
			>
				<div className='p-8 sm:p-10'>
					<div className='flex justify-center mb-6'>
						<div className='bg-[#4CAF50]/10 rounded-full p-4'>
							<CheckCircle className='text-[#4CAF50] w-16 h-16' />
						</div>
					</div>

					<h1 className='text-2xl sm:text-3xl font-extrabold text-center text-[#4CAF50] mb-3'>Order Successful</h1>

					<p className='text-[#222222] text-center mb-1 font-bold'>Thank you for your purchase.</p>
					<p className='text-[#6B6B6B] text-center text-sm mb-8'>
						Your order has been received and is now being processed by our team.
					</p>

					<div className='bg-[#FAFAFA] rounded-xl p-5 mb-8 border border-[#E0E0E0]'>
						<div className='flex items-center justify-between mb-3'>
							<span className='text-xs font-bold text-[#9E9E9E] uppercase'>Order Status:</span>
							<span className='text-sm font-bold text-[#4CAF50]'> Confirmed</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-xs font-bold text-[#9E9E9E] uppercase'>Delivery</span>
							<span className='text-sm font-bold text-[#1F2A44]'> 3-5 Business Days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full inline-flex items-center justify-center gap-2 bg-[#1F2A44] hover:bg-[#162033] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md group'
							onClick={() => navigate("/profile/orders")}
						>
							<HandHeart className='h-5 w-5 text-[#C97C5D]' />
							Track My Order
						</button>
						<Link
							to='/'
							className='w-full inline-flex items-center justify-center gap-2 border border-[#1F2A44] text-[#1F2A44] bg-white hover:bg-[#F5F5F5] font-bold py-3 px-6 rounded-lg transition-all duration-200 group'
						>
							Continue Shopping
							<ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform duration-200' />
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseSuccessPage;