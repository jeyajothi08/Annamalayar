import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Map } from 'lucide-react';

const ContactSection = () => {
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.134812328766!2d78.14873177579177!3d9.925233690176882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c5bc6af96cc9%3A0xe54e60bbbf8b0126!2sAnnamalaiyar%20Recovery%20%26%20Towing%20Service!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Annamalaiyar+Recovery+%26+Towing+Service,+Melamadai,+Madurai";
  const whatsappUrl = "https://wa.me/919585587999?text=Hello,%20I%20need%20emergency%20towing%20service.";

  return (
    <section id="contact-info" className="py-20 bg-brand-secondary/40 border-y border-white/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center md:text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-text-secondary max-w-xl">
            Stuck in an emergency? Contact us directly. Our recovery teams are active 24/7.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Contact details */}
          <div className="flex flex-col justify-between gap-8">
            
            {/* Info Cards */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
              
              {/* Address */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-lg mb-1">Our Address</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    No. 18B/4, Vandiyur Main Rd,Shenbagathottam Colony,<br />
                    Vandiyur, Melamadai, Madurai, Tamil Nadu 625020
                  </p>
                  <p className="text-xs text-accent font-semibold mt-2">
                    🗺️ Near Rice Mill, Melamadai
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Emergency Phone */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center text-danger shrink-0 animate-pulse-soft">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-lg mb-1">Emergency Helpline</h4>
                  <p className="text-text-secondary text-sm mb-2">Tap to call our coordinator directly 24/7</p>
                  <a
                    href="tel:+919585587999"
                    className="text-2xl font-extrabold text-danger hover:text-danger-hover transition tracking-tight"
                  >
                    +91 95855 87999
                  </a>
                </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Business Hours */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-lg mb-1">Business Hours</h4>
                  <p className="text-green-400 text-sm font-semibold mb-1">
                    🕒 Open 24 Hours / 7 Days a Week
                  </p>
                  <p className="text-text-secondary text-xs">
                    Ready for recovery dispatch even on national holidays.
                  </p>
                </div>
              </div>

            </div>

            {/* WhatsApp Trigger Card */}
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/5 border border-green-500/20 p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div>
                <h4 className="font-heading font-bold text-white text-lg mb-1">Need Live Tracking Assistance?</h4>
                <p className="text-text-secondary text-sm">
                  Send your live location over WhatsApp for instant dispatch.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25d366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-xl font-bold transition shadow-md shadow-green-500/20 shrink-0"
              >
                <MessageSquare size={18} />
                WhatsApp Message
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps */}
          <div className="flex flex-col gap-4 h-full min-h-[400px]">
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/5 shadow-2xl h-full">
              <iframe
                src={mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Annamalaiyar Recovery & Towing Service Location"
              ></iframe>
            </div>
            
            {/* Directions button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand-tertiary hover:bg-brand-tertiary/80 text-white border border-white/5 py-4 rounded-xl font-semibold shadow-md transition"
            >
              <Map size={18} className="text-accent" />
              Get Directions on Google Maps
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
