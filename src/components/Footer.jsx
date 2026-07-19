import React from 'react';

const Footer = () => {
  const handleScrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#05070d] border-t border-white/5 py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Footer Logo */}
        <div className="text-center mb-8">
          <h2 className="font-heading font-extrabold text-white text-2xl tracking-tight">
            ANNAMALAIYAR
          </h2>
          <p className="text-accent text-xs font-bold tracking-[3px] uppercase mt-1">
            Recovery & Towing Service
          </p>
        </div>

        {/* Footer Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-semibold text-text-secondary mb-8">
          <button onClick={() => handleScrollTo('home')} className="hover:text-white transition cursor-pointer">Home</button>
          <button onClick={() => handleScrollTo('services')} className="hover:text-white transition cursor-pointer">Services</button>
          <button onClick={() => handleScrollTo('why-us')} className="hover:text-white transition cursor-pointer">Why Choose Us</button>
          <button onClick={() => handleScrollTo('gallery')} className="hover:text-white transition cursor-pointer">Gallery</button>
          <button onClick={() => handleScrollTo('reviews')} className="hover:text-white transition cursor-pointer">Reviews</button>
          <button onClick={() => handleScrollTo('contact-info')} className="hover:text-white transition cursor-pointer">Contact</button>
        </nav>

        {/* Separator */}
        <div className="w-full max-w-xl h-px bg-white/5 mb-6"></div>

        {/* Credits and copyrights */}
        <div className="text-center text-xs text-text-muted flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl gap-4">
          <span>
            © {new Date().getFullYear()} Annamalaiyar Recovery & Towing Service. All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            Made for Madurai Drivers. <span className="text-accent">★ Verified by Justdial.</span>
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
