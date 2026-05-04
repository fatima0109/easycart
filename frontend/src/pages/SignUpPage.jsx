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
    if (!validatePassword(formData.password)) return toast.error("Password does not meet requirements");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");

    // This calls the backend, sends OTP to email, and stores data in Redis
    const success = await signup(formData);
    if (success) setIsVerifying(true); 
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter the 6-digit code");
    await verifyOTP(formData.email, otp);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F5F3EF] relative z-10">
      <motion.div className="sm:mx-auto sm:w-full sm:max-w-md" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1F2A44]">
          {isVerifying ? "Verify Your Email" : "Create Your Account"}
        </h2>
      </motion.div>

      <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card shadow-xl rounded-2xl border border-[#E0E0E0] bg-white overflow-visible">
          <div className="card-body p-8 sm:p-10">
            
            <AnimatePresence mode="wait">
              {!isVerifying ? (
                /* --- STEP 1: SIGNUP FORM --- */
                <motion.form key="signup" onSubmit={handleSubmit} className="space-y-4" exit={{ opacity: 0, x: -20 }}>
                  <div>
                    <label className="form-label block text-sm font-bold text-[#222222]">Full Name</label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D] z-30" />
                      <input type="text" required className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold text-[#222222]">Email Address</label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D] z-30" />
                      <input type="email" required className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold text-[#222222]">Password</label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D] z-30" />
                      <input type="password" required className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
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
                                {isMet ? <Check size={12} className="text-[#4CAF50]" /> : <X size={12} className="text-[#9E9E9E]" />}
                                <span className={`text-[11px] font-medium ${isMet ? 'text-[#4CAF50]' : 'text-[#9E9E9E]'}`}>{req.label}</span>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold text-[#222222]">Confirm Password</label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D] z-30" />
                      <input type="password" required className="form-control block w-full px-3 py-2.5 pl-10 border-[#E0E0E0] rounded-xl" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    </div>
                  </div>

                  {/* RESTORED SIGN UP BUTTON */}
                  <button
                    type="submit"
                    className="btn w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-[#C97C5D] hover:bg-[#B96A4E] transition-all disabled:opacity-50 mt-4"
                    disabled={loading}
                  >
                    {loading ? <Loader className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                    <span>Sign Up</span>
                  </button>
                </motion.form>
              ) : (
                /* --- STEP 2: OTP VERIFICATION FORM --- */
                <motion.form key="otp" onSubmit={handleVerify} className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="text-center">
                    <p className="text-sm text-[#6B6B6B] font-medium">We've sent a 6-digit code to <br/><span className="font-bold text-[#1F2A44]">{formData.email}</span></p>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold text-center text-[#222222]">Enter OTP</label>
                    <div className="mt-1 relative">
                      <KeyRound className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D] z-30" />
                      <input 
                        type="text" 
                        maxLength="6"
                        required 
                        className="form-control block w-full px-3 py-3 pl-10 text-center tracking-[1em] font-bold text-2xl border-[#E0E0E0] rounded-xl" 
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-sm font-bold text-white bg-[#1F2A44] hover:opacity-90 transition-all"
                    disabled={loading}
                  >
                    {loading ? <Loader className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                    <span>Verify & Create Account</span>
                  </button>

                  <button type="button" onClick={() => setIsVerifying(false)} className="w-full text-sm text-[#9E9E9E] font-bold hover:text-[#C97C5D] transition-colors">
                    Change Email / Go Back
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!isVerifying && (
              <p className="mt-8 text-center text-sm text-[#6B6B6B] font-medium">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-[#1F2A44] hover:text-[#C97C5D]">
                  Sign in here <ArrowRight className="h-4 w-4 inline" />
                </Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;