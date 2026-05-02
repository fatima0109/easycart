import { Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SearchBar Component - Amazon Style Redesign
 * Layout: [ All v ] [ Search products...          ] [ Q ]
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
			className='flex items-center w-full h-10 bg-white border border-[#E0E0E0] rounded-md overflow-hidden'
		>
			{/* Left "All" Section - Matches Image 2 */}
			<div className='flex items-center gap-1 px-3 h-full bg-[#F3F3F3] border-r border-[#E0E0E0] cursor-pointer hover:bg-[#EAEAEA] transition-colors'>
				<span className='text-xs font-bold text-[#555]'>All</span>
				<ChevronDown className='h-3 w-3 text-[#555]' />
			</div>

			{/* Middle Input Area - Text area goes till the copper icon */}
			<div className='relative flex-grow h-full flex items-center'>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full h-full px-4 bg-transparent text-[#222222] placeholder-[#9E9E9E] focus:outline-none font-medium text-sm'
				/>
				
				{/* Clear (X) Button */}
				{searchQuery && (
					<button
						type='button'
						onClick={() => setSearchQuery("")}
						className='absolute right-2'
					>
						<X className='h-4 w-4 text-[#9E9E9E] hover:text-[#222222]' />
					</button>
				)}
			</div>

			{/* Right Copper Search Icon Block */}
			<button
				type='submit'
				className='bg-[#C97C5D] h-full w-12 flex items-center justify-center hover:bg-[#b36b4f] transition-colors'
			>
				<Search className='h-5 w-5 text-white' strokeWidth={2.5} />
			</button>
		</form>
	);
};

export default SearchBar;