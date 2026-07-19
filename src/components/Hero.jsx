import React from 'react';
import { Phone, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

const Hero = () => {
  const handleScrollToServices = (e) => {
    e.preventDefault();
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-[radial-gradient(circle_at_10%_20%,rgba(19,26,48,0.5)_0%,rgba(10,14,26,0.98)_90%)] overflow-hidden"
    >
      {/* Decorative Blur Background Graphic */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-accent/10 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-danger/5 to-transparent rounded-full filter blur-[80px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="max-w-3xl text-center md:text-left">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-full mb-6">
            <span className="w-2.5 h-2.5 bg-accent rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-accent tracking-wider uppercase font-heading">
              ⚡ 24/7 Rapid Roadside Assistance
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight mb-6">
            Professional Car Towing & <br className="hidden md:block" />
            <span className="text-gradient">Vehicle Recovery in Madurai</span>
          </h1>

          {/* Paragraph description */}
          <p className="text-lg text-text-secondary mb-8 max-w-2xl leading-relaxed">
            Stuck on the road? Broken down or met with an accident? Annamalaiyar Recovery & Towing Service provides prompt, affordable, and damage-free towing anywhere in Madurai. Under 30 minutes arrival guaranteed!
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center md:justify-start">
            <a
              href="tel:+919585587999"
              className="flex items-center justify-center gap-2 bg-danger hover:bg-danger-hover text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-danger/35 hover:-translate-y-0.5 transition duration-300"
            >
              <Phone size={20} />
              Call Emergency Help
            </a>
            <a
              href="#services"
              onClick={handleScrollToServices}
              className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-base font-bold hover:-translate-y-0.5 transition duration-300"
            >
              Our Towing Services
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Trust Factors / Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 max-w-lg">
            <div className="flex flex-col gap-1 border-l-2 border-accent pl-3">
              <span className="text-xl md:text-2xl font-bold text-white">4.9/5 ★</span>
              <span className="text-xs text-text-muted font-medium">Justdial Verified</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-accent pl-3">
              <span className="text-xl md:text-2xl font-bold text-white">10+ Yrs</span>
              <span className="text-xs text-text-muted font-medium">Experience</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-accent pl-3">
              <span className="text-xl md:text-2xl font-bold text-white">30 Min</span>
              <span className="text-xs text-text-muted font-medium">Response time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
