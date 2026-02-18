import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Lock, User, ChevronDown, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

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

const AuthSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'passenger' as Role });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', role: 'passenger' as Role });
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { value: Role; label: string; description: string }[] = [
    { value: 'admin', label: 'Admin / Organizer', description: 'Manage fleet, routes & users' },
    { value: 'passenger', label: 'Student / Employee', description: 'Reserve seats & view routes' },
    { value: 'driver', label: 'Driver', description: 'View schedule & passengers' },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', loginForm);
    // Will connect to backend API later
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup submitted:', signupForm);
    // Will connect to backend API later
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
                {activeTab === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
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

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-all duration-200 shadow-lg shadow-primary-700/25 hover:shadow-primary-800/30 active:scale-[0.98]"
                    >
                      Log In
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
                          onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type="email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          placeholder="Create a strong password"
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
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
