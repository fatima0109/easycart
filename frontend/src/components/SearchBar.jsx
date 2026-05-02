import { Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SearchBar Component - Amazon Style Redesign
 * Layout: [ All v ] [ Search products...          ] [ Q ]
 */
const SearchBar = ({ onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [category, setCategory] = useState("all");
	const navigate = useNavigate();

	// Category list based on your store's categories
	const categories = [
		{ id: "all", name: "All" },
		{ id: "jewellery", name: "Jewellery" },
		{ id: "gaming", name: "Gaming" },
		{ id: "kitchen", name: "Kitchen" },
		{ id: "fashion", name: "Fashion" },
		{ id: "appliances", name: "Appliances" },
		{ id: "electronics", name: "Electronics" },
	];

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Navigates with both search term and category
			let url = `/search?search=${encodeURIComponent(searchQuery.trim())}`;
			if (category !== "all") url += `&category=${category}`;
			
			navigate(url);
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
			{/* Left Category Selector Block - Matches Amazon style */}
			<div className='relative h-full flex items-center bg-[#F3F3F3] border-r border-[#E0E0E0] hover:bg-[#EAEAEA] transition-colors'>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className='h-full pl-3 pr-7 bg-transparent border-none outline-none text-[#555] font-medium text-xs cursor-pointer appearance-none z-10'
				>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
				<ChevronDown className='absolute right-2 h-3 w-3 text-[#555] pointer-events-none' />
			</div>

			{/* Middle Input Area - flex-grow ensures it fills all space till the copper icon */}
			<div className='relative flex-grow h-full flex items-center'>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='w-full h-full px-4 border-none outline-none bg-transparent text-[#222222] placeholder-[#9E9E9E] font-medium text-sm'
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
				className='bg-[#C97C5D] h-full px-5 flex items-center justify-center hover:bg-[#b36b4f] transition-colors'
			>
				<Search className='h-5 w-5 text-white' strokeWidth={2.5} />
			</button>
		</form>
	);
};

export default SearchBar;