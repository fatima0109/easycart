import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Check, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading, user } = useUserStore();
  const navigate = useNavigate();

  // Password Validation State
  const requirements = [
    { re: /.{8,}/, label: "At least 8 characters" },
    { re: /[A-Z]/, label: "One uppercase letter" },
    { re: /[a-z]/, label: "One lowercase letter" },
    { re: /[0-9]/, label: "One number" },
    { re: /[^A-Za-z0-9]/, label: "One special character (!@#$)" },
  ];

  const validatePassword = (pass) => {
    return requirements.every((req) => req.re.test(pass));
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
        toast.error("Password does not meet requirements");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
    }
    signup(formData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F5F3EF] relative z-10">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1F2A44]">
          Create Your Account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card shadow-xl rounded-2xl border border-[#E0E0E0] bg-white overflow-visible">
          <div className="card-body p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="form-label block text-sm font-bold text-[#222222]">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-30">
                    <User className="h-5 w-5 text-[#C97C5D]" />
                  </div>
                  <input
                    type="text"
                    required
                    className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="form-label block text-sm font-bold text-[#222222]">Email Address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-30">
                    <Mail className="h-5 w-5 text-[#C97C5D]" />
                  </div>
                  <input
                    type="email"
                    required
                    className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="form-label block text-sm font-bold text-[#222222]">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-30">
                    <Lock className="h-5 w-5 text-[#C97C5D]" />
                  </div>
                  <input
                    type="password"
                    required
                    className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {/* STRICTNESS CHECKER UI */}
                <div className="mt-3 p-3 bg-[#F5F3EF] rounded-xl border border-[#E0E0E0]">
                  <p className="text-[10px] font-bold text-[#1F2A44] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#C97C5D]" /> Password Security
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {requirements.map((req, i) => {
                      const isMet = req.re.test(formData.password);
                      return (
                        <div key={i} className="flex items-center gap-2">
                          {isMet ? (
                            <Check size={12} className="text-[#4CAF50]" strokeWidth={3} />
                          ) : (
                            <X size={12} className="text-[#9E9E9E]" strokeWidth={3} />
                          )}
                          <span className={`text-[11px] font-medium ${isMet ? 'text-[#4CAF50]' : 'text-[#9E9E9E]'}`}>
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="form-label block text-sm font-bold text-[#222222]">Confirm Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-30">
                    <Lock className="h-5 w-5 text-[#C97C5D]" />
                  </div>
                  <input
                    type="password"
                    required
                    className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center gap-2 py-3 px-4 border-0 rounded-lg shadow-md text-sm font-bold text-white bg-[#C97C5D] hover:bg-[#B96A4E] transition-all disabled:opacity-50 mt-4"
                disabled={loading}
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                <span>Sign Up</span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#6B6B6B] font-medium">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-[#1F2A44] hover:text-[#C97C5D]">
                Sign in here <ArrowRight className="h-4 w-4 inline" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;