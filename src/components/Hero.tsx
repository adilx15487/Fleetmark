import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Shield, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating route dots */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[15%] w-3 h-3 bg-accent-400/40 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[60%] right-[20%] w-2 h-2 bg-primary-300/40 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[30%] left-[40%] w-4 h-4 bg-accent-400/20 rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-accent-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                Now Accepting Reservations
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Smart
              <br />
              Transportation.
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-primary-300 bg-clip-text text-transparent">
                Reserved for You.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-lg sm:text-xl text-primary-200/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              The modern seat reservation and fleet management platform for schools, 
              universities, and enterprises. Never miss your ride again.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="#auth"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-800 font-bold text-lg hover:bg-primary-50 transition-all duration-200 shadow-2xl shadow-black/20 hover:shadow-white/20"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Learn More
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0"
            >
              {[
                { value: '500+', label: 'Active Riders' },
                { value: '25+', label: 'Routes' },
                { value: '99%', label: 'On Time' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-primary-300/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustrative card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main dashboard preview card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-danger-500/80" />
                  <div className="w-3 h-3 rounded-full bg-warning-500/80" />
                  <div className="w-3 h-3 rounded-full bg-success-500/80" />
                  <span className="ml-2 text-white/40 text-sm">Fleetmark Dashboard</span>
                </div>

                {/* Mock route card */}
                <div className="bg-white/10 rounded-2xl p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-400/20 rounded-xl">
                        <MapPin className="w-5 h-5 text-accent-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Route A — Campus Express</p>
                        <p className="text-primary-300/60 text-sm">Main Gate → Library → Labs → Dorms</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success-500/20 text-success-500 text-xs font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-white">32</p>
                      <p className="text-xs text-primary-300/60 mt-1">Seats Left</p>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-accent-400">7:30</p>
                      <p className="text-xs text-primary-300/60 mt-1">Next Departure</p>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-white">4</p>
                      <p className="text-xs text-primary-300/60 mt-1">Stops</p>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                      <Shield className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Seat Reserved</p>
                      <p className="text-primary-300/60 text-xs">Seat 14A</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-accent-400/20 rounded-lg">
                      <Clock className="w-4 h-4 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">ETA</p>
                      <p className="text-primary-300/60 text-xs">12 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-4 border border-primary-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-500/10 rounded-xl flex items-center justify-center">
                    <span className="text-success-500 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-900">Seat Confirmed!</p>
                    <p className="text-xs text-slate-400">Route A — Seat 14A</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
