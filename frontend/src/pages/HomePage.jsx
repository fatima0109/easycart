import { useEffect } from "react";
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import PriceFilter from "../components/PriceFilter";
import { useProductStore } from "../stores/useProductStore";

const categories = [
	{ href: "jewellery", name: "Jewellery", imageUrl: "/jewellery.jpg" },
	{ href: "gaming", name: "Gaming Setup", imageUrl: "/gaming.webp" },
	{ href: "kitchen", name: "Kitchen Essentials", imageUrl: "/kitchen.jpg" },
	{ href: "fashion", name: "Modern Fashion", imageUrl: "/fashion.jpg" },
	{ href: "appliances", name: "Home Appliances", imageUrl: "/appliances.jpg" },
	{ href: "electronics", name: "Electronics", imageUrl: "/electronics.webp" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, fetchFilteredProducts, products, featuredProducts, loading } = useProductStore();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const isSearching = queryParams.get("search") || queryParams.get("category") || queryParams.get("minPrice") || queryParams.get("maxPrice");

	useEffect(() => {
		if (isSearching) {
			fetchFilteredProducts({
				search: queryParams.get("search"),
				category: queryParams.get("category"),
				minPrice: queryParams.get("minPrice"),
				maxPrice: queryParams.get("maxPrice"),
			});
		} else {
			fetchFeaturedProducts();
		}
	}, [location.search, fetchFeaturedProducts, fetchFilteredProducts, isSearching]);

	return (
		<div className='min-h-screen bg-[#F5F3EF] font-sans text-[#222222]'>
			{isSearching ? (
				/* --- SEARCH RESULTS VIEW --- */
				<section className='container py-5 mt-4'>
					<div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-[#E0E0E0] mb-5">
						<div className="row align-items-center g-3">
							<div className="col-md-8">
								<h2 className='h3 fw-bold text-[#1F2A44] mb-1'>
									Found {products.length} Results
								</h2>
								<p className="text-[#6B6B6B] small mb-0">
                                    {queryParams.get("search") ? `Showing items for "${queryParams.get("search")}"` : "Browsing our collection"}
                                </p>
							</div>
							<div className="col-md-4 text-md-end">
								<Link to='/' className='btn btn-link text-[#FF782D] fw-bold text-decoration-none'>
									Clear Filters
								</Link>
							</div>
						</div>
						<hr className="my-4 border-[#E0E0E0]" />
						<PriceFilter />
					</div>

					{loading ? (
						<div className="d-flex justify-content-center py-5"><LoadingSpinner /></div>
					) : (
						<div className='row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4'>
							{products.length > 0 ? (
								products.map((product) => (
									<div key={product._id} className="col">
										<ProductCard product={product} />
									</div>
								))
							) : (
								<div className="col-12 text-center py-5">
									<div className="bg-white p-5 rounded-3xl border border-[#E0E0E0]">
										<p className='text-[#6B6B6B] mb-4'>No products found matching your criteria.</p>
										<Link to="/" className="btn bg-[#1F2A44] text-white px-5 py-2 rounded-lg fw-bold border-0">
											Reset Search
										</Link>
									</div>
								</div>
							)}
						</div>
					)}
				</section>
			) : (
				<>
                    {/* --- PREMIUM HERO SECTION --- */}
                    <section className='position-relative overflow-hidden py-5 py-md-5 mt-4'>
                        <div className='container'>
                            <div className="row justify-content-center"> 
                                <div className="col-lg-8 text-center"> 
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                        <span className="badge bg-[#FF782D] px-3 py-2 rounded-pill text-uppercase tracking-widest fw-bold mb-3" style={{ fontSize: '10px' }}>
                                            New Season Arrival
                                        </span>
                                        <h1 className='display-3 fw-bold text-[#1F2A44] mb-4 lh-sm'>
                                            Elevate Your <br /> Everyday Living.
                                        </h1>
                                        <p className='h5 text-[#6B6B6B] mb-5 fw-normal lh-base'>
                                            Discover a curated selection of high-end jewellery, <br className="d-none d-md-block" /> pro gaming gear, and modern home essentials.
                                        </p>
                                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                                            <Link to='/category/fashion' className='btn bg-[#FF782D] text-white px-5 py-3 rounded-3 fw-bold shadow-sm hover-lift border-0'>
                                                Shop Collection <ArrowRight className='ms-2' size={18} />
                                            </Link>
                                            <Link to='/category/gaming' className='btn bg-white border border-[#E0E0E0] text-[#1F2A44] px-5 py-3 rounded-3 fw-bold hover-grey'>
                                                Gaming Tech
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </section>

					<section className="bg-white border-y border-[#E0E0E0] py-4">
						<div className="container">
							<div className="row g-4 text-center">
								<div className="col-md-4 d-flex align-items-center justify-content-center gap-3">
									<Truck className="text-[#FF782D]" size={32} />
									<div className="text-start">
										<p className="fw-bold mb-0">Free Delivery</p>
										<small className="text-[#6B6B6B]">On all orders over $200</small>
									</div>
								</div>
								<div className="col-md-4 d-flex align-items-center justify-content-center gap-3 border-md-start border-[#E0E0E0]">
									<ShieldCheck className="text-[#FF782D]" size={32} />
									<div className="text-start">
										<p className="fw-bold mb-0">Secure Payment</p>
										<small className="text-[#6B6B6B]">100% protected checkout</small>
									</div>
								</div>
								<div className="col-md-4 d-flex align-items-center justify-content-center gap-3 border-md-start border-[#E0E0E0]">
									<RotateCcw className="text-[#FF782D]" size={32} />
									<div className="text-start">
										<p className="fw-bold mb-0">30-Day Return</p>
										<small className="text-[#6B6B6B]">Easy and simple returns</small>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* --- CATEGORY SECTION --- */}
                    <section className='py-5'>
                        <div className='container py-4'>
                            <div className="d-flex justify-content-between align-items-end mb-5">
                                <div>
                                    <h2 className='h2 fw-bold text-[#1F2A44] mb-2'>Shop by Category</h2>
                                    <p className='text-[#6B6B6B] mb-0'>Find premium quality in every department.</p>
                                </div>
                                <Link to="/category/fashion" className="text-[#FF782D] fw-bold text-decoration-none d-none d-md-block">
                                    Browse All Categories <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 category-grid'>
                                {categories.map((category) => (
                                    <div key={category.name} className="col">
                                        <CategoryItem category={category} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- FEATURED SECTION --- */}
                    {!loading && featuredProducts?.length > 0 && (
    <section className='py-5 bg-white border-y border-[#E0E0E0] featured-section'>
        <div className="container">
            <FeaturedProducts featuredProducts={featuredProducts} />
        </div>
    </section>
)}

                    {/* --- TESTIMONIALS SECTION --- */}
                    <section className="py-5 bg-[#F5F3EF]">
                        <div className="container py-4">
                            <div className="text-center mb-5">
                                <h2 className="h2 fw-bold text-[#1F2A44] mb-3">Customer Experiences</h2>
                                <div className="d-flex justify-content-center gap-1 text-[#FF782D]">
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                </div>
                            </div>

                            <div className="row g-4">
                                {[
                                    { name: "Sara Khan", city: "Islamabad", rating: 5, text: "The silver hoops I bought are stunning. High quality and fast shipping!" },
                                    { name: "Muhammad Ahmed", city: "Lahore", rating: 4, text: "Finally found a gaming setup that looks as good as it performs." },
                                    { name: "Alia Hassan", city: "Karachi", rating: 5, text: "The kitchen collection is professional grade. Excellent!" },
                                ].map((testimonial, index) => (
                                    <div key={index} className="col-md-4">
                                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4 hover-lift bg-white">
                                            <p className="card-text text-[#6B6B6B] fst-italic mb-4 lh-base small">"{testimonial.text}"</p>
                                            <div className="mt-auto pt-3 border-top border-[#E0E0E0]">
                                                <h6 className="fw-bold text-[#1F2A44] mb-0">{testimonial.name}</h6>
                                                <small className="text-[#9E9E9E]">{testimonial.city}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- STEP 10: NAVY FOOTER CTA SECTION --- */}
                    <section className="py-5 pb-5">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-10 bg-[#1F2A44] rounded-4 p-5 text-center text-white shadow-2xl overflow-hidden position-relative">
                                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: '#FFFFFF', opacity: 0.03 }}></div>
                                    <div className="position-relative z-1">
                                        <h2 className="display-5 fw-bold mb-3">Upgrade Your Lifestyle</h2>
                                        <p className="text-gray-400 mb-5 h5 fw-normal">Join 50,000+ shoppers who trust ShopHub for premium quality gear.</p>
                                        <Link to="/category/fashion" className="btn bg-[#FF782D] text-white px-5 py-3 rounded-3 fw-bold border-0 hover-lift shadow">
                                            Start Shopping Today <ArrowRight className="ms-2" size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
				</>
			)}
		</div>
	);
};

export default HomePage;