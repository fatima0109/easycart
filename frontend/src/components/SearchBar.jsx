import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SearchBar Component - Professional Formal Redesign
 * Fixed to match Amazon-style layout with Copper search block
 */
const SearchBar = ({ onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
			onClose?.(); 
		}
	};

	return (
		<form 
			id='search-form' 
			onSubmit={handleSearch} 
			className='w-full h-10 flex items-center bg-white border border-[#E0E0E0] rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#C97C5D]'
		>
			{/* Text Input Area - Fills all available space */}
			<div className='relative flex-grow h-full flex items-center'>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full h-full px-4 bg-transparent text-[#222222] placeholder-[#9E9E9E] focus:outline-none font-medium text-sm'
				/>
				
				{/* Clear (X) Button - Only shows when typing */}
				{searchQuery && (
					<button
						type='button'
						onClick={() => setSearchQuery("")}
						className='px-2'
					>
						<X className='h-4 w-4 text-[#9E9E9E] hover:text-[#222222] transition-colors' />
					</button>
				)}
			</div>

			{/* Copper Search Icon Block - Fixed to the end */}
			<button
				type='submit'
				className='bg-[#C97C5D] h-full px-5 flex items-center justify-center hover:bg-[#b36b4f] transition-colors'
			>
				<Search className='h-5 w-5 text-white' />
			</button>
		</form>
	);
};

export default SearchBar;