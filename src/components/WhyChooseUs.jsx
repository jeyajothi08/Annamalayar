import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const WhyChooseUs = () => {
  const points = [
    {
      title: "Under 30-Minutes Response",
      desc: "Strategically stationed flatbed trucks ensure we reach Melamadai, Vandiyur, and city limits inside half an hour."
    },
    {
      title: "Certified & Insured Operators",
      desc: "Our truck drivers are background-checked, highly trained in accident recovery, and handle keys with maximum care."
    },
    {
      title: "100% Damage-Free Loading",
      desc: "Equipped with low-profile ramps, soft-wheel straps, and modern underlifts to accommodate low clearance cars."
    },
    {
      title: "Transparent Emergency Rates",
      desc: "No hidden charges, zero hook-up penalties. Honest price estimates provided on-call before dispatching."
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-brand-secondary/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content column */}
          <div>
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-3 font-heading">
              Trusted Recovery Team
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
              Why Drivers in Madurai Count On Us
            </h2>
            <p className="text-text-secondary mb-10 leading-relaxed">
              We know vehicle breakdowns are stressful. Our target is to restore your day with minimal disruption, using safe towing methods and transparent local pricing.
            </p>

            <div className="flex flex-col gap-6">
              {points.map((point, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0 mt-1">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-base mb-1">
                      {point.title}
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Column */}
          <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-video lg:aspect-square">
            <img
              src="/towing-team.png"
              alt="Annamalaiyar Towing and Recovery Team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-brand-primary/85 backdrop-blur-md p-6 rounded-xl border border-white/5">
              <span className="text-2xl font-bold text-white block mb-1">1,500+</span>
              <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">
                Vehicles Towed Safely & Safely Recovered
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
