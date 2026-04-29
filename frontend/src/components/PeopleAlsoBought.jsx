// frontend/src/components/PeopleAlsoBought.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Added missing import
import ProductCard from "./ProductCard";
import axios from "../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

/**
 * PeopleAlsoBought Component - Professional Formal Redesign
 * Uses Deep Navy (#1F2A44) and Muted Copper (#C97C5D)
 */
const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendations");
        setRecommendations(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred while fetching recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="mt-12 pt-8 border-t border-[#E0E0E0]">
      {/* Section Header - Deep Navy and Copper Accent */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#1F2A44] inline-block">
          People also bought
        </h3>
        <div className="w-16 h-1 bg-[#C97C5D] rounded-full mt-2"></div>
      </motion.div>

      {/* Grid using White/Neutral styling via ProductCard */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {recommendations.map((product) => (
          <motion.div key={product._id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state (Secondary Text) */}
      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6B6B6B] font-medium">
            No recommendations available at the moment.
          </p>
        </div>
      )}
    </section>
  );
};

export default PeopleAlsoBought;