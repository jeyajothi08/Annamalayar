import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MessageSquare, ShieldCheck, Clock, MapPin, 
  ChevronDown, Star, ArrowRight, X, ZoomIn, Check,
  Activity, Award, Sparkles, AlertCircle, CheckCircle2,
  Truck, ShieldAlert, Compass, Wrench, Bike
} from 'lucide-react';
import { serviceData } from './serviceData';
import SEO from './SEO';

const getLucideIcon = (name, className = "w-6 h-6") => {
  switch (name) {
    case "Truck":
      return <Truck className={className} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Wrench":
      return <Wrench className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Bike":
      return <Bike className={className} />;
    default:
      return <Truck className={className} />;
  }
};

// Simple Animated Counter Component using standard React state hooks
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Extract numerical value from string if needed
    const endVal = parseInt(end.toString().replace(/[^0-9]/g, ''), 10);
    if (isNaN(endVal)) return;

    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    const increment = endVal / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= endVal) {
        clearInterval(timer);
        setCount(endVal);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>{count}{suffix}</span>
  );
};

const ServiceDetail = () => {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    location: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: null, text: '' });
  const [loading, setLoading] = useState(false);

  // Retrieve service details or redirect if slug is invalid
  const service = serviceData[serviceSlug];

  useEffect(() => {
    if (!service) {
      // If service is not found, redirect to home page
      navigate('/');
    }
  }, [service, navigate]);

  if (!service) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.vehicle || !formData.location) {
      setStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, text: '' });

    // Build the descriptive request message
    const formattedMessage = `[Emergency Request from ${service.title} Page] 
Vehicle: ${formData.vehicle} 
Location: ${formData.location}
Details: ${formData.message || 'No additional details provided.'}`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          vehicle: formData.vehicle,
          message: formattedMessage
        })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: 'Your service request has been logged. Our dispatch team is calling you back immediately!' });
        setFormData({ name: '', phone: '', vehicle: '', location: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to submit service request.' });
      }
    } catch (err) {
      console.error('Service request form error:', err);
      setStatus({ type: 'error', text: 'Network error. Please call the emergency hotline directly for immediate dispatch.' });
    } finally {
      setLoading(false);
    }
  };

  // Find other services for "Related Services" section
  const relatedServices = Object.keys(serviceData)
    .filter(slug => slug !== serviceSlug)
    .slice(0, 3)
    .map(slug => serviceData[slug]);

  // Page Transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  return (
    <motion.div 
      className="bg-[#0B1020] min-h-screen text-white pt-20 pb-16 overflow-x-hidden font-sans selection:bg-[#F59E0B] selection:text-[#0B1020]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <SEO 
        title={`${service.title} in Madurai | 24/7 Annamalaiyar Towing`}
        description={`Get reliable, professional ${service.title} services in Madurai and across Tamil Nadu highways. Available 24/7. Call +91 95855 87999 for quick dispatch.`}
        ogImage={service.heroImage}
      />
      {/* Decorative Blur Background Graphics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#F59E0B]/10 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-red-500/5 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-gradient-to-bl from-[#F59E0B]/5 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0"></div>

      {/* 1. Large Hero Banner Image */}
      <section className="relative h-[55vh] md:h-[65vh] w-full flex items-center justify-center overflow-hidden z-10">
        <div className="absolute inset-0">
          <img 
            src={service.heroImage} 
            alt={service.title} 
            className="w-full h-full object-cover scale-105 transform transition duration-[10000ms] hover:scale-100" 
          />
          {/* Glassmorphic Dark Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/40 via-[#0B1020]/75 to-[#0B1020]"></div>
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent 30%, #0B1020 95%)"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full text-center mt-12 z-20">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
            <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-[#F59E0B] tracking-widest uppercase font-heading">
              Annamalaiyar Premium Recovery
            </span>
          </div>
          {/* 2. Service Title */}
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-lg">
            {service.title}
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-base md:text-lg font-medium leading-relaxed drop-shadow-md">
            {service.description}
          </p>
        </div>
      </section>

      {/* Trust Badges Row */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-30">
        <div className="glass-panel p-6 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-6 text-center border border-white/10 shadow-2xl bg-gradient-to-r from-[#131a30]/80 via-[#1b2541]/80 to-[#131a30]/80">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <Clock size={20} />
            </div>
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">24/7 Service</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <Award size={20} />
            </div>
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Licensed Ops</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Fully Insured</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <Activity size={20} />
            </div>
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">Fast Response</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <MapPin size={20} />
            </div>
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">GPS Tracking</span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Columns (Span 2) - Detailed Info */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* 3. Professional Description */}
            <motion.div {...fadeInUp} className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 bg-[#131a30]/40">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                Professional Vehicle Logistics
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                {service.detailedDescription}
              </p>
              
              {/* Animated Counters Block */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5 text-center">
                <div className="flex flex-col">
                  <span className="text-2xl md:text-4xl font-heading font-extrabold text-[#F59E0B]">
                    <AnimatedCounter end={1500} suffix="+" />
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Vehicles Towed</span>
                </div>
                <div className="flex flex-col border-x border-white/5">
                  <span className="text-2xl md:text-4xl font-heading font-extrabold text-[#F59E0B]">
                    &lt; <AnimatedCounter end={30} suffix="m" />
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Response Time</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-4xl font-heading font-extrabold text-[#F59E0B]">
                    <AnimatedCounter end={15} suffix="+" />
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Active Trucks</span>
                </div>
              </div>
            </motion.div>

            {/* 4. Key Features Grid */}
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                Service Features & Equipment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features.map((feat, index) => (
                  <div key={index} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#F59E0B]/20 transition-all duration-300 flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 group-hover:bg-[#F59E0B] group-hover:text-[#0B1020] text-[#F59E0B] flex items-center justify-center transition-all duration-300 shrink-0">
                      {getLucideIcon(service.iconName, "w-5 h-5")}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-white text-base mb-1 group-hover:text-[#F59E0B] transition-colors">{feat.title}</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5. Step-by-Step Process */}
            <motion.div {...fadeInUp} className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                How It Works
              </h2>
              <div className="relative pl-6 md:pl-10 space-y-12 before:absolute before:left-[19px] before:md:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#F59E0B] before:via-blue-500/30 before:to-[#131a30]">
                {service.process.map((step, idx) => (
                  <div key={idx} className="relative group flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                    {/* Circle Indicator */}
                    <div className="absolute -left-[19px] md:-left-[27px] w-10 h-10 rounded-full bg-[#131a30] border-2 border-[#F59E0B] flex items-center justify-center text-xs md:text-sm font-bold text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-[#0B1020] transition duration-300 shadow-md">
                      {step.step}
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#131a30]/20 flex-1 ml-6 md:ml-4">
                      <h3 className="text-lg font-heading font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 6. Related Images Gallery */}
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                Job Operations Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.gallery.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setLightboxImg(img.src)}
                    className={`relative rounded-2xl overflow-hidden border border-white/5 group cursor-pointer aspect-square ${index === 0 ? "col-span-2 md:aspect-[2/1]" : ""}`}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <ZoomIn size={18} className="text-[#F59E0B] mb-1" />
                      <span className="text-white font-heading font-bold text-xs md:text-sm">{img.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 7. Benefits Section */}
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                Benefits of Our Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-[#131a30]/20 border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 mt-0.5">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-white text-base mb-1">{benefit.title}</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 8. Frequently Asked Questions (FAQ) */}
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                Common Questions Answered
              </h2>
              <div className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <div key={index} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition duration-200 cursor-pointer"
                    >
                      <span className="font-heading font-bold text-white text-sm md:text-base pr-4">{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-[#F59E0B] transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-white/5 text-gray-400 text-xs md:text-sm leading-relaxed bg-[#131a30]/10">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 12. Customer Reviews */}
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
                <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
                Verified Customer Feedback
              </h2>
              <div className="space-y-4">
                {service.reviews.map((rev, index) => (
                  <div key={index} className="glass-panel p-6 rounded-2xl border border-white/5 relative bg-[#131a30]/30 hover:border-[#F59E0B]/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-heading font-bold text-white text-base">{rev.name}</h4>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              <ShieldCheck size={10} /> Verified Driver
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">Vehicle: <strong className="text-white">{rev.vehicle}</strong></span>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1">
                        <div className="flex gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 font-semibold">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs md:text-sm italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column (Span 1) - Sticky Sidebars */}
          <div className="space-y-8 lg:sticky lg:top-28 self-start">
            
            {/* Direct Emergency Buttons Card */}
            <div className="glass-panel p-8 rounded-3xl border border-[#F59E0B]/20 bg-gradient-to-b from-[#1b2541]/90 to-[#131a30]/90 shadow-2xl relative overflow-hidden">
              {/* Highlight background element */}
              <div className="absolute top-[-50px] right-[-50px] w-28 h-28 bg-[#F59E0B]/10 rounded-full filter blur-xl pointer-events-none"></div>
              
              <span className="text-[10px] font-bold text-[#F59E0B] tracking-widest uppercase block mb-2 font-heading">Emergency Dispatch</span>
              <h3 className="font-heading font-extrabold text-white text-xl mb-4 leading-tight">Need Recovery Fast?</h3>
              <p className="text-gray-300 text-xs md:text-sm mb-6 leading-relaxed">
                Stuck on the road? We have operators online 24/7 to dispatch flatbed wreckers in Madurai immediately.
              </p>
              
              <div className="flex flex-col gap-4">
                {/* 9. Emergency Contact Button */}
                <a
                  href="tel:+919585587999"
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-sm transition shadow-lg shadow-red-600/25 active:scale-95"
                >
                  <Phone size={18} />
                  Call Emergency Support
                </a>
                
                {/* 10. WhatsApp Button */}
                <a
                  href={`https://wa.me/919585587999?text=Hello,%20I%20need%20emergency%20${encodeURIComponent(service.title)}%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1fba57] text-white font-bold py-4 rounded-xl text-sm transition shadow-lg shadow-[#25d366]/20 active:scale-95"
                >
                  <MessageSquare size={18} />
                  WhatsApp Coordinates
                </a>
              </div>
            </div>

            {/* 11. Request Service Form Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-[#131a30]/50 shadow-xl">
              <h3 className="font-heading font-extrabold text-white text-lg mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#F59E0B]" />
                Book Recovery Vehicle
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {status.text && (
                  <div className={`p-4 rounded-xl flex items-start gap-2 border text-xs leading-relaxed ${status.type === 'success' ? 'bg-green-500/10 border-green-500/25 text-green-400' : 'bg-red-500/10 border-red-500/25 text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={14} /> : <AlertCircle className="shrink-0 mt-0.5" size={14} />}
                    <span>{status.text}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh"
                    className="bg-[#0B1020] border border-white/10 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] rounded-xl px-4 py-3 text-white text-xs md:text-sm outline-none transition duration-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 95855 87999"
                    className="bg-[#0B1020] border border-white/10 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] rounded-xl px-4 py-3 text-white text-xs md:text-sm outline-none transition duration-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vehicle" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Make & Model *</label>
                    <input
                      type="text"
                      id="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      placeholder="e.g. Swift / Duke 390"
                      className="bg-[#0B1020] border border-white/10 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] rounded-xl px-4 py-3 text-white text-xs md:text-sm outline-none transition duration-200"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="location" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Location *</label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Melamadai, Madurai"
                      className="bg-[#0B1020] border border-white/10 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] rounded-xl px-4 py-3 text-white text-xs md:text-sm outline-none transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Special Requests (Optional)</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g. Wheel lock issue, transmission block, low-slung car..."
                    className="bg-[#0B1020] border border-white/10 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] rounded-xl px-4 py-3 text-white text-xs md:text-sm outline-none transition duration-200 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#F59E0B]/90 disabled:bg-[#F59E0B]/50 text-[#0B1020] font-bold py-3.5 rounded-xl text-xs md:text-sm transition shadow-lg shadow-[#F59E0B]/10 cursor-pointer active:scale-95"
                >
                  {loading ? "Submitting Request..." : "Request Call Back"}
                </button>

              </form>
            </div>

          </div>

        </div>
      </section>

      {/* 14. Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-10">
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-6 flex items-center gap-3">
          <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
          Emergency Service Area
        </h2>
        <div className="rounded-3xl overflow-hidden border border-white/10 h-[300px] md:h-[400px] shadow-2xl relative group">
          <iframe 
            src="https://maps.google.com/maps?q=Annamalaiyar%20Recovery%20and%20Towing%20Service,%20Melamadai,%20Madurai&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.1) brightness(0.9)" }} 
            allowFullScreen="" 
            loading="lazy"
            title="Google Map Location of Annamalaiyar Recovery and Towing Service"
          ></iframe>
          <div className="absolute bottom-4 left-4 bg-[#0B1020]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 text-[10px] md:text-xs font-semibold text-gray-300">
            📍 Serving Melamadai, Madurai & Highways across Tamil Nadu
          </div>
        </div>
      </section>

      {/* 13. Related Services List */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-white/5 relative z-10">
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-[#F59E0B] rounded-full"></span>
          Other Recovery Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedServices.map((item, index) => (
            <div 
              key={index}
              onClick={() => {
                navigate(`/services/${item.slug}`);
                window.scrollTo(0,0);
              }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#F59E0B]/20 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center text-[#F59E0B] mb-4 group-hover:bg-[#F59E0B] group-hover:text-[#0B1020] transition-colors duration-300 shrink-0">
                {getLucideIcon(item.iconName, "w-6 h-6")}
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-[#F59E0B] transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed">{item.description}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B] font-bold mt-4 uppercase tracking-wider group-hover:gap-2.5 transition-all">
                Learn More <ArrowRight size={12} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="max-w-4xl mx-auto px-4 text-center py-20 relative z-10">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-[#F59E0B]/20 bg-gradient-to-b from-[#1b2541]/70 to-[#0B1020]/75 relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-30px] left-[-30px] w-24 h-24 bg-red-500/10 rounded-full filter blur-xl"></div>
          
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            Need Emergency Towing?
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto mb-8">
            Our operators are on standby 24 hours a day, 7 days a week. Speak to our coordinator directly or request assistance now.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="tel:+919585587999" 
              className="flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0B1020] font-bold px-8 py-4 rounded-xl text-sm transition shadow-lg shadow-[#F59E0B]/10 w-full sm:w-auto hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone size={16} />
              Call Now
            </a>
            <a 
              href="https://wa.me/919585587999?text=Hello,%20I%20need%20emergency%20towing%20service."
              target="_blank"
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-white border border-white/10 font-bold px-8 py-4 rounded-xl text-sm transition w-full sm:w-auto hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageSquare size={16} className="text-[#25d366]" />
              WhatsApp Now
            </a>
            <button 
              onClick={() => {
                const el = document.getElementById('name');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-sm transition w-full sm:w-auto hover:-translate-y-0.5 active:translate-y-0"
            >
              Book Recovery
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal Dialog */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxImg(null)}
          >
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 text-white hover:text-[#F59E0B] transition bg-white/5 hover:bg-white/10 p-2.5 rounded-full cursor-pointer"
            >
              <X size={24} />
            </button>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={lightboxImg} 
                alt="Enlarged Recovery Work" 
                className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-white/10" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 15. Sticky Call Button (Mobile & Desktop Dynamic Overlay) */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-[#0B1020]/90 backdrop-blur-md border-t border-white/5 py-4 px-6 block md:hidden shadow-lg shadow-black/80 animate-fadeIn">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <a
            href="tel:+919585587999"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider"
          >
            <Phone size={14} />
            Call Now
          </a>
          <a
            href={`https://wa.me/919585587999?text=Hello,%20I%20need%20emergency%20${encodeURIComponent(service.title)}%20service.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1fba57] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider"
          >
            <MessageSquare size={14} />
            WhatsApp
          </a>
        </div>
      </div>
      
    </motion.div>
  );
};

export default ServiceDetail;
