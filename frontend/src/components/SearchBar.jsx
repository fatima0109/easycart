import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SearchBar Component - Professional Formal Redesign
 * Uses White (#FFFFFF), Neutral Border (#E0E0E0), and Copper focus (#C97C5D)
 */
const SearchBar = ({ onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Updated to /search to hit the SearchResultsPage
			navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
			onClose?.(); // Close mobile menu if this prop is passed
		}
	};

	return (
		<form id='search-form' onSubmit={handleSearch} className='w-full h-full flex items-center'>
			<div className='relative w-full px-2'>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full px-4 py-1.5 pr-12 rounded-lg bg-white border border-transparent text-[#222222] placeholder-[#9E9E9E] focus:outline-none transition-all font-medium text-sm'
				/>
				
				{/* Right-aligned Icons Container */}
				<div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
					{searchQuery && (
						<button
							type='button'
							onClick={() => setSearchQuery("")}
							className='flex items-center'
						>
							{/* Clear Icon */}
							<X className='h-4 w-4 text-[#9E9E9E] hover:text-[#1F2A44] transition-colors' />
						</button>
					)}
					
					{/* Copper Search Icon at the end */}
					<Search className='h-4 w-4 text-[#C97C5D]' />
				</div>
			</div>
		</form>
	);
};

export default SearchBar;