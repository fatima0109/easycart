import { Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SearchBar Component - Forced Amazon Design
 * Uses Inline Styles to override Bootstrap interference.
 */
const SearchBar = ({ onClose }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [category, setCategory] = useState("all");
	const navigate = useNavigate();

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
			style={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				height: '40px',
				backgroundColor: '#FFFFFF',
				border: '1px solid #E0E0E0',
				borderRadius: '6px',
				overflow: 'hidden'
			}}
		>
			{/* Left Category Section */}
			<div style={{
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				height: '100%',
				backgroundColor: '#F3F3F3',
				borderRight: '1px solid #E0E0E0',
				padding: '0 10px'
			}}>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					style={{
						height: '100%',
						backgroundColor: 'transparent',
						border: 'none',
						outline: 'none',
						fontSize: '13px',
						fontWeight: '600',
						color: '#555555',
						cursor: 'pointer',
						appearance: 'none',
						paddingRight: '20px',
						zIndex: 2
					}}
				>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>{cat.name}</option>
					))}
				</select>
				<ChevronDown style={{
					position: 'absolute',
					right: '8px',
					height: '14px',
					width: '14px',
					color: '#555555',
					pointerEvents: 'none'
				}} />
			</div>

			{/* Center Input Area - Fills all space till copper button */}
			<div style={{ position: 'relative', flexGrow: 1, height: '100%' }}>
				<input
					type='text'
					placeholder='Search products...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{
						width: '100%',
						height: '100%',
						padding: '0 15px',
						border: 'none',
						outline: 'none',
						backgroundColor: 'transparent',
						fontSize: '14px',
						color: '#222222',
						boxShadow: 'none' // Removes Bootstrap focus glow
					}}
				/>
				
				{searchQuery && (
					<button
						type='button'
						onClick={() => setSearchQuery("")}
						style={{
							position: 'absolute',
							right: '10px',
							top: '50%',
							transform: 'translateY(-50%)',
							background: 'none',
							border: 'none',
							padding: 0,
							cursor: 'pointer'
						}}
					>
						<X size={16} color="#9E9E9E" />
					</button>
				)}
			</div>

			{/* Right Copper Button Block */}
			<button
				type='submit'
				style={{
					backgroundColor: '#C97C5D',
					height: '100%',
					width: '50px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: 'none',
					cursor: 'pointer',
					transition: 'background-color 0.2s'
				}}
				onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b36b4f'}
				onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C97C5D'}
			>
				<Search size={20} color="white" strokeWidth={2.5} />
			</button>
		</form>
	);
};

export default SearchBar;