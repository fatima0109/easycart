import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Check, X, ShieldCheck, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isVerifying, setIsVerifying] = useState(false); // Track OTP mode
  const [otp, setOtp] = useState(""); // Track OTP value

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

  // Handle Initial Signup (Step 1)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) return toast.error("Password too weak");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");

    const success = await signup(formData);
    if (success) setIsVerifying(true); // Switch to OTP UI
  };

  // Handle OTP Verification (Step 2)
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter a 6-digit code");
    await verifyOTP(formData.email, otp);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F5F3EF] relative z-10">
      <motion.div className="sm:mx-auto sm:w-full sm:max-w-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1F2A44]">
          {isVerifying ? "Verify Your Email" : "Create Your Account"}
        </h2>
      </motion.div>

      <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="card shadow-xl rounded-2xl border border-[#E0E0E0] bg-white">
          <div className="card-body p-8 sm:p-10">
            
            <AnimatePresence mode="wait">
              {!isVerifying ? (
                /* --- SIGNUP FORM --- */
                <motion.form key="signup" onSubmit={handleSubmit} className="space-y-4" exit={{ opacity: 0, x: -20 }}>
                  <div>
                    <label className="form-label block text-sm font-bold">Full Name</label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D]" />
                      <input type="text" required className="form-control pl-10 w-full" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold">Email Address</label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D]" />
                      <input type="email" required className="form-control pl-10 w-full" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold">Password</label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D]" />
                      <input type="password" required className="form-control pl-10 w-full" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    {/* Password Checker (Simplified for brevity) */}
                    <div className="mt-3 p-2 bg-[#F5F3EF] rounded-lg">
                      {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px]">
                           {req.re.test(formData.password) ? <Check size={10} className="text-green-500"/> : <X size={10} className="text-gray-400"/>}
                           <span className={req.re.test(formData.password) ? "text-green-600" : "text-gray-500"}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold">Confirm Password</label>
                    <div className="mt-1 relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D]" />
                      <input type="password" required className="form-control pl-10 w-full" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                    </div>
                  </div>

                  <button type="submit" className="btn w-full bg-[#C97C5D] text-white py-3 mt-4" disabled={loading}>
                    {loading ? <Loader className="animate-spin m-auto" /> : "Send Verification Code"}
                    <span>Send Verification Code</span>
                  </button>
                </motion.form>
              ) : (
                /* --- OTP VERIFICATION FORM --- */
                <motion.form key="otp" onSubmit={handleVerify} className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">We've sent a 6-digit code to <br/><span className="font-bold text-[#1F2A44]">{formData.email}</span></p>
                  </div>

                  <div>
                    <label className="form-label block text-sm font-bold text-center">Enter OTP</label>
                    <div className="mt-1 relative">
                      <KeyRound className="absolute left-3 top-3 h-5 w-5 text-[#C97C5D]" />
                      <input 
                        type="text" 
                        maxLength="6"
                        required 
                        className="form-control pl-10 text-center tracking-[1em] font-bold text-2xl w-full" 
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn w-full bg-[#1F2A44] text-white py-3" disabled={loading}>
                    {loading ? <Loader className="animate-spin m-auto" /> : "Verify & Create Account"}
                  </button>

                  <button type="button" onClick={() => setIsVerifying(false)} className="w-full text-sm text-gray-400 hover:text-[#C97C5D]">
                    Change Email / Go Back
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!isVerifying && (
              <p className="mt-8 text-center text-sm font-medium">
                Already have an account? <Link to="/login" className="font-bold text-[#1F2A44]">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;