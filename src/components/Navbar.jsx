import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Menu, X, ShieldAlert, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, admin, logout, adminLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener to make header background solid
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    
    // If not on home page, navigate to home first and then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-primary/95 shadow-lg border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-md shadow-accent/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#0a0e1a">
              <path d="M19 13v-2c0-1.1-.9-2-2-2h-3V7.5c0-.83-.67-1.5-1.5-1.5H8v1h4.5c.28 0 .5.22.5.5V9H5c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.18c.24 1.69 1.69 3 3.47 3s3.24-1.31 3.47-3h3.06c.24 1.69 1.69 3 3.47 3s3.24-1.31 3.47-3H23v-2h-4zm-9 4c-.83 0-1.5-.67-1.5-1.5S9.17 14 10 14s1.5.67 1.5 1.5S10.83 17 10 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div>
            <span className="font-heading font-extrabold text-white text-lg tracking-tight block">ANNAMALAIYAR</span>
            <span className="text-[10px] text-accent font-bold tracking-[2px] block uppercase -mt-1">Recovery & Towing</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={() => handleNavClick('home')} className="text-sm font-semibold text-text-secondary hover:text-white cursor-pointer transition">Home</button>
          <button onClick={() => handleNavClick('services')} className="text-sm font-semibold text-text-secondary hover:text-white cursor-pointer transition">Services</button>
          <button onClick={() => handleNavClick('why-us')} className="text-sm font-semibold text-text-secondary hover:text-white cursor-pointer transition">Why Choose Us</button>
          <button onClick={() => handleNavClick('gallery')} className="text-sm font-semibold text-text-secondary hover:text-white cursor-pointer transition">Gallery</button>
          <button onClick={() => handleNavClick('reviews')} className="text-sm font-semibold text-text-secondary hover:text-white cursor-pointer transition">Reviews</button>
          <button onClick={() => handleNavClick('contact')} className="text-sm font-semibold text-text-secondary hover:text-white cursor-pointer transition">Contact</button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+919585587999"
            className="flex items-center gap-2 bg-danger hover:bg-danger-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-danger/25 transition duration-300"
          >
            <Phone size={16} />
            +91 95855 87999
          </a>

          {admin ? (
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="flex items-center gap-2 border border-accent/30 bg-accent/10 hover:bg-accent hover:text-brand-primary text-accent px-4 py-2 rounded-lg text-xs font-semibold transition"
              >
                <ShieldAlert size={14} />
                Admin Panel
              </Link>
              <button
                onClick={adminLogout}
                className="text-text-muted hover:text-white transition cursor-pointer"
                title="Admin Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 border border-white/10 hover:border-white/30 text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
              >
                <User size={14} />
                Profile ({user.name.split(' ')[0]})
              </Link>
              <button
                onClick={logout}
                className="text-text-muted hover:text-white transition cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-white/10 hover:border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white hover:text-accent transition cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-brand-primary z-45 flex flex-col px-6 py-8 gap-6 border-t border-white/5 animate-fadeIn">
          <nav className="flex flex-col gap-5 text-lg font-medium">
            <button onClick={() => handleNavClick('home')} className="text-left text-text-secondary hover:text-white transition">Home</button>
            <button onClick={() => handleNavClick('services')} className="text-left text-text-secondary hover:text-white transition">Services</button>
            <button onClick={() => handleNavClick('why-us')} className="text-left text-text-secondary hover:text-white transition">Why Choose Us</button>
            <button onClick={() => handleNavClick('gallery')} className="text-left text-text-secondary hover:text-white transition">Gallery</button>
            <button onClick={() => handleNavClick('reviews')} className="text-left text-text-secondary hover:text-white transition">Reviews</button>
            <button onClick={() => handleNavClick('contact')} className="text-left text-text-secondary hover:text-white transition">Contact</button>
          </nav>

          <div className="h-px bg-white/5 my-2"></div>

          <div className="flex flex-col gap-4">
            <a
              href="tel:+919585587999"
              className="flex items-center justify-center gap-2 bg-danger hover:bg-danger-hover text-white py-3.5 rounded-lg font-bold shadow-md shadow-danger/25 transition"
            >
              <Phone size={18} />
              +91 95855 87999
            </a>

            {admin ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-accent/20 border border-accent/30 text-accent py-3 rounded-lg font-semibold text-center"
                >
                  <ShieldAlert size={16} />
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    adminLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-text-muted hover:text-white transition py-2"
                >
                  <LogOut size={16} /> Admin Logout
                </button>
              </div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 border border-white/10 text-white py-3 rounded-lg font-semibold text-center"
                >
                  <User size={16} />
                  My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-text-muted hover:text-white transition py-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="border border-white/10 text-center text-white py-3.5 rounded-lg font-semibold transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
