import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import Logo from '../components/Logo';
import { ShieldCheck, Mail, Lock, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Clear error on component mount
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  const handleQuickFill = (roleEmail,rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword); // Seeded password for all users
    dispatch(clearError());
    setValidationError('');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#070b13] px-4">
      {/* Dynamic Glowing Accent Backgrounds */}
      <div className="glow-spot-blue top-[-100px] left-[-100px]"></div>
      <div className="glow-spot-emerald bottom-[-150px] right-[-100px]"></div>

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <Logo className="flex items-center gap-3 mb-2" iconSize="w-10 h-10" textSize="text-2xl" />
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1.5">
            Employee Core Banking Portal
          </p>
        </div>

        {/* Error Notifications */}
        {(validationError || error) && (
          <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm mb-6 animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Alert</p>
              <p className="text-xs opacity-90">{validationError || error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
               Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@niyorabank.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border glass-input text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border glass-input text-sm font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Access Systems'
            )}
          </button>
        </form>

        {/* Quick Credentials Seeder Section */}
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <p className="text-xs font-medium text-slate-500 text-center mb-4">
            Select Employee Role to Auto-Fill Setup
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Admin', email: 'nileshrahangdale08@gmail.com', password: 'Nilesh123' },
              { label: 'Manager', email: 'manager@example.com', password: 'Manager123' },
              { label: 'Teller', email: 'teller@example.com', password: 'Teller123' },
              { label: 'CSO', email: 'cso@niyorabank.com', password: 'CSO123' },
            ].map((role) => (
              <button
                key={role.label}
                type="button"
                onClick={() => handleQuickFill(role.email,role.password)}
                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-850 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-800/50 rounded-lg cursor-pointer transition-all duration-150 text-center"
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
