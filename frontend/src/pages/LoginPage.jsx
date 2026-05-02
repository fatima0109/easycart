import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/secret-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F5F3EF]">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1F2A44]">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-[#6B6B6B] font-medium uppercase tracking-tight">
          Sign in to your account
        </p>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* BOOTSTRAP 'card' container */}
        <div className="card shadow-xl rounded-2xl border border-[#E0E0E0] bg-white overflow-hidden">
          <div className="card-body p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="form-label block text-sm font-bold text-[#222222]">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-[#C97C5D]" aria-hidden="true" />
                  </div>
                  {/* BOOTSTRAP 'form-control' applied */}
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control block w-full px-3 py-2.5 pl-10 bg-white border border-[#E0E0E0] rounded-xl text-[#222222] placeholder-[#9E9E9E] focus:ring-2 focus:ring-[#C97C5D] focus:border-[#C97C5D] sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="form-label block text-sm font-bold text-[#222222]">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-[#C97C5D]" aria-hidden="true" />
                  </div>
                  {/* BOOTSTRAP 'form-control' applied */}
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control block w-full px-3 py-2.5 pl-10 bg-white border border-[#E0E0E0] rounded-xl text-[#222222] placeholder-[#9E9E9E] focus:ring-2 focus:ring-[#C97C5D] focus:border-[#C97C5D] sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* BOOTSTRAP 'btn' and 'btn-primary' applied */}
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center gap-2 py-3 px-4 border-0 rounded-lg shadow-md text-sm font-bold text-white bg-[#C97C5D] hover:bg-[#B96A4E] transition-all disabled:opacity-50 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#6B6B6B] font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#1F2A44] hover:text-[#C97C5D] transition-colors duration-200 inline-flex items-center gap-1 group"
              >
                Register now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;