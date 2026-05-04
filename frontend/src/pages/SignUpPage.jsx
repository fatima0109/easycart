import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Check, X, ShieldCheck, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");

  const { signup, verifyOTP, loading, user } = useUserStore();
  const navigate = useNavigate();

  const requirements = [
    { re: /.{8,}/, label: "At least 8 characters" },
    { re: /[A-Z]/, label: "One uppercase letter" },
    { re: /[a-z]/, label: "One lowercase letter" },
    { re: /[0-9]/, label: "One number" },
    { re: /[^A-Za-z0-9]/, label: "One special character (!@#$)" },
  ];

  const validatePassword = (pass) => requirements.every((req) => req.re.test(pass));

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) return toast.error("Password too weak");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");

    const success = await signup(formData);
    if (success) setIsVerifying(true);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter a 6-digit code");
    await verifyOTP(formData.email, otp);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F5F3EF] relative z-10">
      <motion.div className="sm:mx-auto sm:w-full sm:max-w-md text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-4xl font-bold text-[#1F2A44] mb-2">
          {isVerifying ? "Verify Account" : "Welcome"}
        </h2>
        <p className="text-[#6B6B6B] mb-8">
           {isVerifying ? "Enter the code sent to your mail" : "Sign up to start shopping"}
        </p>
      </motion.div>

      <motion.div className="sm:mx-auto sm:w-full sm:max-w-xl px-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#E0E0E0]">
          
          <AnimatePresence mode="wait">
            {!isVerifying ? (
              /* --- SIGNUP FORM --- */
              <motion.form key="signup" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#222222]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222]" />
                    <input type="text" required className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#C97C5D]" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#222222]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222]" />
                    <input type="email" required className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#C97C5D]" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#222222]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222]" />
                    <input type="password" required className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#C97C5D]" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  {/* Validation UI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mt-2">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-1">
                        {req.re.test(formData.password) ? <Check size={14} className="text-green-500"/> : <span className="text-gray-400">×</span>}
                        <span className={req.re.test(formData.password) ? "text-green-600 font-medium" : "text-gray-500"}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-[#222222]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222]" />
                    <input type="password" required className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#C97C5D]" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                  </div>
                </div>

                {/* THE "SIGN IN STYLE" BUTTON */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-6 py-2.5 border-0 rounded-lg shadow-md text-sm font-bold text-white bg-[#C97C5D] hover:bg-[#B96A4E] transition-all disabled:opacity-50 mt-4"
                    disabled={loading}
                    style={{ width: 'fit-content', minWidth: '160px' }}
                  >
                    {loading ? (
                       <Loader className="animate-spin h-5 w-5 m-auto" /> 
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5" />
                        <span>Sign Up</span>
                      </>
                    )}
                  </button>

                  <p className="text-sm text-[#6B6B6B]">
                    Already have an account? <Link to="/login" className="text-[#0056b3] hover:underline">Sign in</Link>
                  </p>
                </div>
              </motion.form>
            ) : (
              /* --- OTP FORM --- */
              <motion.form key="otp" onSubmit={handleVerify} className="space-y-8 py-4">
                <div className="text-center space-y-2">
                  <p className="text-gray-600">Verification code sent to:</p>
                  <p className="font-bold text-[#1F2A44]">{formData.email}</p>
                </div>

                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#222222]" />
                  <input 
                    type="text" 
                    maxLength="6"
                    required 
                    className="w-full pl-10 py-3 text-center tracking-[0.5em] font-bold text-2xl border border-[#E0E0E0] rounded-lg focus:border-[#C97C5D] outline-none" 
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button 
                    type="submit" 
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1F2A44] text-white rounded-lg font-bold hover:opacity-90 transition-all w-full sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? <Loader className="animate-spin h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    Verify & Create Account
                  </button>

                  <button type="button" onClick={() => setIsVerifying(false)} className="text-sm text-gray-500 hover:text-[#C97C5D] underline">
                    Change Email / Go Back
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;