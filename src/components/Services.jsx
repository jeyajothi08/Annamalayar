import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Compass, Wrench, ShieldAlert, Bike, LifeBuoy, ArrowRight } from 'lucide-react';

const Services = () => {
  const serviceList = [
    {
      slug: "flatbed-car-towing",
      icon: <Truck className="w-8 h-8" />,
      title: "Flatbed Car Towing",
      desc: "The safest way to transport luxury cars, automatic vehicles, and heavily damaged SUVs. Complete flatbed tray guarantees zero wear and tear on wheels."
    },
    {
      slug: "accident-recovery",
      icon: <LifeBuoy className="w-8 h-8" />,
      title: "Accident & Recovery",
      desc: "Equipped with heavy hydraulic winches and underlift lifters to recover vehicles from deep ditches, trenches, canal beds, or crash sites safely."
    },
    {
      slug: "long-distance-towing",
      icon: <Compass className="w-8 h-8" />,
      title: "Long Distance Towing",
      desc: "Moving a car across Tamil Nadu or to a specialist workshop? We offer secured long-distance towing rates with real-time ETA tracking."
    },
    {
      slug: "roadside-assistance",
      icon: <Wrench className="w-8 h-8" />,
      title: "24/7 Roadside Assistance",
      desc: "On-the-spot troubleshooting for flat tires, battery drainage, out-of-fuel distress, and vehicle key lockout emergencies. Call +91 95855 87999."
    },
    {
      slug: "heavy-commercial-recovery",
      icon: <ShieldAlert className="w-8 h-8" />,
      title: "Heavy Commercial Recovery",
      desc: "Professional rescue, recovery, and heavy vehicle towing for trucks, public buses, utility trailers, and loaders in Melamadai, Madurai."
    },
    {
      slug: "bike-scooter-towing",
      icon: <Bike className="w-8 h-8" />,
      title: "Bike & Scooter Towing",
      desc: "Custom wheel mounts and strap configurations for motorcycles, superbikes, and gearless scooters. Complete safety and damage-free transit."
    }
  ];

  return (
    <section id="services" className="py-24 bg-brand-primary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 relative inline-block">
            Our Specialized Rescue Services
            <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-6">
            We provide full-scale vehicle recovery, towing, and flatbed transport services utilizing state-of-the-art tools and highly certified operators. Click on any card to view detailed specifications.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <Link
              to={`/services/${service.slug}`}
              key={index}
              className="glass-panel p-8 rounded-2xl border-l-4 border-l-transparent hover:border-l-accent hover:border-r-white/10 hover:border-y-white/10 hover:-translate-y-2 transition-all duration-300 group block cursor-pointer"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-brand-primary transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-accent transition">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {service.desc}
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider group-hover:gap-3 transition-all duration-200">
                View Full Details <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;

