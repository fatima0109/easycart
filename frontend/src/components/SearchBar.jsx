import { Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SearchBar Component - Fixed with Left Category Selector
 * Layout matches the clean Amazon-style bar with "All ▼" on the left,
 * search input in the middle, and the copper icon block at the end.
 * Color scheme and placeholder text remain unchanged.
 */
const SearchBar = ({ onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [category, setCategory] = useState("all");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Optional: Include category in search if needed
			// For now, just pass the search query to maintain original behavior
			navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
			onClose?.(); 
		}
	};

	return (
		<form 
			id='search-form' 
			onSubmit={handleSearch} 
			className='flex items-center w-full h-full bg-white overflow-hidden'
		>
			{/* Category Dropdown - "All ▼" on the left */}
			<div className="relative h-full">
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="h-full px-4 pr-8 bg-transparent border-none outline-none text-[#222222] font-medium text-sm cursor-pointer appearance-none"
					aria-label="Search category"
				>
					<option value="all">All</option>
					<option value="electronics">Electronics</option>
					<option value="fashion">Fashion</option>
					<option value="books">Books</option>
				</select>
				<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[#9E9E9E] pointer-events-none" />
			</div>

			{/* Divider line between category and search input */}
			<div className="h-6 w-px bg-[#E5E5E5]"></div>

			{/* Text Area: Fills all space from the divider till the copper icon */}
			<div className='relative'>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full h-full px-4 pr-8 border-none outline-none bg-transparent text-[#222222] placeholder-[#9E9E9E] font-medium text-sm'
				/>

				{/* Clear (X) Button - Positioned just before the copper icon */}
				{searchQuery && (
					<button
						type='button'
						onClick={() => setSearchQuery("")}
						className='absolute right-2'
					>
						<X className='h-4 w-4 text-[#9E9E9E] hover:text-[#222222] transition-colors' />
					</button>
				)}
			</div>

			{/* Copper Search Icon Block: Fixed at the very end */}
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