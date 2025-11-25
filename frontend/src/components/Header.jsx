import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navItems } from '../mock';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-lg shadow-lg'
          : 'bg-black/40 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain animate-fade-in" />
            <h1 className="text-2xl lg:text-3xl font-black text-[#FF1B6D] tracking-tight">
              zerounproduction
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-white hover:text-[#FF1B6D] transition-colors duration-200 font-medium text-sm uppercase tracking-wide ${
                  location.pathname === item.href ? 'text-[#FF1B6D]' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-[#FF1B6D] transition-colors p-2"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <nav className="bg-black/95 backdrop-blur-lg px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`block w-full text-left text-white hover:text-[#FF1B6D] transition-colors duration-200 font-medium text-base uppercase tracking-wide py-2 ${
                location.pathname === item.href ? 'text-[#FF1B6D]' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};