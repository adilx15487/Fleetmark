import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Bus } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Get Started', href: '#auth' },
    { label: 'Subscribe', href: '#subscribe' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-primary-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors duration-300 ${
              scrolled ? 'bg-primary-800' : 'bg-white/10 backdrop-blur-sm'
            }`}>
              <Bus className={`w-6 h-6 transition-colors duration-300 ${
                scrolled ? 'text-accent-400' : 'text-white'
              }`} />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-primary-900' : 'text-white'
            }`}>
              Fleetmark
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? 'text-slate-600 hover:text-primary-700 hover:bg-primary-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#auth"
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                scrolled
                  ? 'text-primary-700 hover:bg-primary-50'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Log In
            </a>
            <a
              href="#auth"
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                scrolled
                  ? 'bg-primary-700 text-white hover:bg-primary-800 shadow-lg shadow-primary-700/25'
                  : 'bg-white text-primary-800 hover:bg-white/90 shadow-lg shadow-black/10'
              }`}
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-primary-800 hover:bg-primary-50' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-primary-100 shadow-xl"
        >
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-700 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex gap-3">
              <a
                href="#auth"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
              >
                Log In
              </a>
              <a
                href="#auth"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center px-4 py-3 rounded-xl bg-primary-700 text-white font-semibold hover:bg-primary-800 transition-colors shadow-lg shadow-primary-700/25"
              >
                Sign Up
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
