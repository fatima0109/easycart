// frontend/src/components/PriceFilter.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, XCircle } from "lucide-react";

const PriceFilter = () => {
	const navigate = useNavigate();
	const location = useLocation();
	
	// Initialize state from URL so inputs don't clear on refresh
	const queryParams = new URLSearchParams(location.search);
	const [min, setMin] = useState(queryParams.get("minPrice") || "");
	const [max, setMax] = useState(queryParams.get("maxPrice") || "");

	// Sync state if URL changes (e.g., user clicks 'Clear' or 'Back')
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setMin(params.get("minPrice") || "");
		setMax(params.get("maxPrice") || "");
	}, [location.search]);

	const applyPriceFilter = () => {
		const params = new URLSearchParams(location.search);
		
		if (min) params.set("minPrice", min);
		else params.delete("minPrice");
		
		if (max) params.set("maxPrice", max);
		else params.delete("maxPrice");

		// Navigates to current path (Home or Category) with updated params
		navigate(`${location.pathname}?${params.toString()}`);
	};

	const clearFilters = () => {
		setMin("");
		setMax("");
		navigate(location.pathname); // Removes all query params
	};

	return (
		<div className='flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl border border-[#E0E0E0] shadow-sm mb-8'>
			{/* Label */}
			<div className='flex items-center gap-2 text-[#1F2A44] font-bold'>
				<Filter size={18} className="text-[#C97C5D]" />
				<span className="text-xs uppercase tracking-widest">Price Range</span>
			</div>
			
			{/* Inputs */}
			<div className="flex items-center gap-2">
				<input
					type='number'
					placeholder='Min $'
					value={min}
					min="0"
					onChange={(e) => setMin(e.target.value)}
					className='bg-[#F5F3EF] text-[#1F2A44] p-2 rounded-lg border border-transparent w-24 focus:outline-none focus:ring-1 focus:ring-[#C97C5D] transition-all text-sm font-medium'
				/>
				<span className="text-[#9E9E9E]">—</span>
				<input
					type='number'
					placeholder='Max $'
					value={max}
					min="0"
					onChange={(e) => setMax(e.target.value)}
					className='bg-[#F5F3EF] text-[#1F2A44] p-2 rounded-lg border border-transparent w-24 focus:outline-none focus:ring-1 focus:ring-[#C97C5D] transition-all text-sm font-medium'
				/>
			</div>

			{/* Apply Button */}
			<button
				onClick={applyPriceFilter}
				className='bg-[#1F2A44] hover:bg-[#162033] px-6 py-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider transition-all hover:shadow-md'
			>
				Apply
			</button>

			{/* Clear Button (Only shows if filters are active) */}
			{(queryParams.get("minPrice") || queryParams.get("maxPrice")) && (
				<button 
					onClick={clearFilters}
					className="flex items-center gap-1 text-xs text-[#D9534F] hover:text-red-700 font-bold transition-colors ml-auto"
				>
					<XCircle size={14} />
					Reset
				</button>
			)}
		</div>
	);
};

export default PriceFilter;