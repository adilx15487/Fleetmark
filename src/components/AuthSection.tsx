import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { AtSign, Lock, User, ChevronDown, Eye, EyeOff, LogIn, UserPlus, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

type AuthTab = 'login' | 'signup';
type Role = 'admin' | 'passenger' | 'driver';

const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;

interface FormErrors {
  [key: string]: string;
}

const AuthSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();
  const { login, loginWith42, isLoading, error, clearError, getDashboardPath } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', role: 'passenger' as Role });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'passenger' as Role });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [signupErrors, setSignupErrors] = useState<FormErrors>({});
  const [loginTouched, setLoginTouched] = useState<Record<string, boolean>>({});
  const [signupTouched, setSignupTouched] = useState<Record<string, boolean>>({});
  const [is42Loading, setIs42Loading] = useState(false);

  // --- Validation helpers ---
  const validateLoginField = useCallback((field: string, value: string): string => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (!usernameRegex.test(value)) return 'Enter a valid username (min 3 chars)';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  }, []);

  const validateSignupField = useCallback((field: string, value: string, form?: typeof signupForm): string => {
    const f = form || signupForm;
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== f.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  }, [signupForm]);

  const handleLoginBlur = (field: string) => {
    setLoginTouched((p) => ({ ...p, [field]: true }));
    const err = validateLoginField(field, loginForm[field as keyof typeof loginForm]);
    setLoginErrors((p) => ({ ...p, [field]: err }));
  };

  const handleSignupBlur = (field: string) => {
    setSignupTouched((p) => ({ ...p, [field]: true }));
    const err = validateSignupField(field, signupForm[field as keyof typeof signupForm]);
    setSignupErrors((p) => ({ ...p, [field]: err }));
  };

  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {};
    errors.username = validateLoginField('username', loginForm.username);
    errors.password = validateLoginField('password', loginForm.password);
    setLoginErrors(errors);
    setLoginTouched({ username: true, password: true });
    return !errors.username && !errors.password;
  };

  const validateSignupForm = (): boolean => {
    const errors: FormErrors = {};
    errors.fullName = validateSignupField('fullName', signupForm.fullName);
    errors.email = validateSignupField('email', signupForm.email);
    errors.password = validateSignupField('password', signupForm.password);
    errors.confirmPassword = validateSignupField('confirmPassword', signupForm.confirmPassword);
    setSignupErrors(errors);
    setSignupTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    return !errors.fullName && !errors.email && !errors.password && !errors.confirmPassword;
  };

  const roles: { value: Role; label: string; description: string }[] = [
    { value: 'admin', label: 'Admin / Organizer', description: 'Manage fleet, routes & users' },
    { value: 'passenger', label: 'Student / Employee', description: 'Reserve seats & view routes' },
    { value: 'driver', label: 'Driver', description: 'View schedule & passengers' },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    clearError();
    const success = await login(loginForm.username, loginForm.password, loginForm.role);
    if (success) {
      toast('Welcome back! 👋');
      navigate(getDashboardPath(loginForm.role));
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;
    toast('Account created successfully! 🎉');
    console.log('Signup submitted:', signupForm);
    // Will connect to backend API later
  };

  const handle42Login = async () => {
    setIs42Loading(true);
    clearError();
    const outcome = await loginWith42();
    setIs42Loading(false);
    if (outcome.result === 'role-select') {
      navigate('/auth/role-select');
    } else if (outcome.result === 'dashboard') {
      toast('Welcome back! 👋');
      navigate(outcome.path);
    }
  };

  const currentRole = activeTab === 'login' ? loginForm.role : signupForm.role;
  const setCurrentRole = (role: Role) => {
    if (activeTab === 'login') {
      setLoginForm({ ...loginForm, role });
    } else {
      setSignupForm({ ...signupForm, role });
    }
    setRoleDropdownOpen(false);
  };

  return (
    <section id="auth" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Info */}
          <div>
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0}
              className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4"
            >
              Get Started
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-900 leading-tight"
            >
              Your Ride Awaits.
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Join Fleetmark Today.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={2}
              className="mt-6 text-lg text-slate-500 leading-relaxed"
            >
              Whether you're an admin managing a fleet, a student looking for a guaranteed
              seat, or a driver keeping your route on track — Fleetmark is designed for you.
            </motion.p>

            {/* Role cards */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={3}
              className="mt-10 space-y-4"
            >
              {roles.map((role) => (
                <div
                  key={role.value}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900 text-sm">{role.label}</p>
                    <p className="text-slate-400 text-xs">{role.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Auth Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={2}
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-primary-100/20 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => { setActiveTab('login'); setRoleDropdownOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'login'
                      ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setRoleDropdownOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'signup'
                      ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* 42 Intra OAuth Button */}
                <button
                  type="button"
                  onClick={handle42Login}
                  disabled={is42Loading || isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all duration-200 shadow-lg shadow-gray-900/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mb-6"
                >
                  {is42Loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting to 42…
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-black tracking-tight">42</span>
                      Continue with 42 Intra
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">or login with credentials</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {activeTab === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type="text"
                          value={loginForm.username}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, username: e.target.value });
                            if (loginTouched.username) setLoginErrors((p) => ({ ...p, username: validateLoginField('username', e.target.value) }));
                          }}
                          onBlur={() => handleLoginBlur('username')}
                          placeholder="your_username"
                          autoComplete="username"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                            loginTouched.username && loginErrors.username
                              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                        />
                      </div>
                      {loginTouched.username && loginErrors.username && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{loginErrors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, password: e.target.value });
                            if (loginTouched.password) setLoginErrors((p) => ({ ...p, password: validateLoginField('password', e.target.value) }));
                          }}
                          onBlur={() => handleLoginBlur('password')}
                          placeholder="Enter your password"
                          className={`w-full pl-12 pr-12 py-3.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                            loginTouched.password && loginErrors.password
                              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {loginTouched.password && loginErrors.password && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{loginErrors.password}</p>
                      )}
                    </div>

                    {/* Role Selector */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        >
                          <span className="text-slate-700">
                            {roles.find((r) => r.value === loginForm.role)?.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {roleDropdownOpen && (
                          <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                            {roles.map((role) => (
                              <button
                                key={role.value}
                                type="button"
                                onClick={() => { setLoginForm({ ...loginForm, role: role.value }); setRoleDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-50 transition-colors ${
                                  loginForm.role === role.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600'
                                }`}
                              >
                                <span className="font-medium">{role.label}</span>
                                <span className="block text-xs text-slate-400 mt-0.5">{role.description}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {error && activeTab === 'login' && (
                      <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-all duration-200 shadow-lg shadow-primary-700/25 hover:shadow-primary-800/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Logging in…
                        </>
                      ) : (
                        'Log In'
                      )}
                    </button>

                    <p className="text-center text-sm text-slate-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-primary-600 font-semibold hover:text-primary-700"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleSignupSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type="text"
                          value={signupForm.fullName}
                          onChange={(e) => {
                            setSignupForm({ ...signupForm, fullName: e.target.value });
                            if (signupTouched.fullName) setSignupErrors((p) => ({ ...p, fullName: validateSignupField('fullName', e.target.value) }));
                          }}
                          onBlur={() => handleSignupBlur('fullName')}
                          placeholder="John Doe"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                            signupTouched.fullName && signupErrors.fullName
                              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                        />
                      </div>
                      {signupTouched.fullName && signupErrors.fullName && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{signupErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type="email"
                          value={signupForm.email}
                          onChange={(e) => {
                            setSignupForm({ ...signupForm, email: e.target.value });
                            if (signupTouched.email) setSignupErrors((p) => ({ ...p, email: validateSignupField('email', e.target.value) }));
                          }}
                          onBlur={() => handleSignupBlur('email')}
                          placeholder="you@example.com"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                            signupTouched.email && signupErrors.email
                              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                        />
                      </div>
                      {signupTouched.email && signupErrors.email && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{signupErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupForm.password}
                          onChange={(e) => {
                            setSignupForm({ ...signupForm, password: e.target.value });
                            if (signupTouched.password) setSignupErrors((p) => ({ ...p, password: validateSignupField('password', e.target.value) }));
                          }}
                          onBlur={() => handleSignupBlur('password')}
                          placeholder="Create a strong password"
                          className={`w-full pl-12 pr-12 py-3.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                            signupTouched.password && signupErrors.password
                              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signupTouched.password && signupErrors.password && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{signupErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupForm.confirmPassword}
                          onChange={(e) => {
                            setSignupForm({ ...signupForm, confirmPassword: e.target.value });
                            if (signupTouched.confirmPassword) setSignupErrors((p) => ({ ...p, confirmPassword: validateSignupField('confirmPassword', e.target.value, { ...signupForm, confirmPassword: e.target.value }) }));
                          }}
                          onBlur={() => handleSignupBlur('confirmPassword')}
                          placeholder="Re-enter your password"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm focus:ring-2 outline-none transition-all placeholder:text-slate-300 ${
                            signupTouched.confirmPassword && signupErrors.confirmPassword
                              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                        />
                      </div>
                      {signupTouched.confirmPassword && signupErrors.confirmPassword && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{signupErrors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Role Selector */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        >
                          <span className="text-slate-700">
                            {roles.find((r) => r.value === signupForm.role)?.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {roleDropdownOpen && (
                          <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                            {roles.map((role) => (
                              <button
                                key={role.value}
                                type="button"
                                onClick={() => { setSignupForm({ ...signupForm, role: role.value }); setRoleDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-50 transition-colors ${
                                  signupForm.role === role.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600'
                                }`}
                              >
                                <span className="font-medium">{role.label}</span>
                                <span className="block text-xs text-slate-400 mt-0.5">{role.description}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-all duration-200 shadow-lg shadow-primary-700/25 hover:shadow-primary-800/30 active:scale-[0.98]"
                    >
                      Create Account
                    </button>

                    <p className="text-center text-sm text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-primary-600 font-semibold hover:text-primary-700"
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
