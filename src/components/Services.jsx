import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Compass, Wrench, ShieldAlert, Bike, LifeBuoy, ArrowRight } from 'lucide-react';

const Services = () => {
  const serviceList = [
    {
      slug: "car-towing-madurai",
      icon: <Truck className="w-8 h-8" />,
      title: "Car Towing in Madurai",
      desc: "Reliable, 20-minute local towing for hatchbacks, sedans, and SUVs. Best rates in Melamadai, Mattuthavani, Anna Nagar, and all of Madurai city."
    },
    {
      slug: "bike-towing-madurai",
      icon: <Bike className="w-8 h-8" />,
      title: "Bike Towing in Madurai",
      desc: "Safe scratch-free motorcycle and scooter towing inside Madurai. Utilizing wheel-lock cradles and soft straps for cruisers, gearless scooters, and superbikes."
    },
    {
      slug: "flatbed-towing",
      icon: <Truck className="w-8 h-8" />,
      title: "Flatbed Towing",
      desc: "Hydraulic flatbeds for premium luxury cars, electric vehicles, automatic transmission cars, and low-clearance vehicles with zero wheel-to-ground contact."
    },
    {
      slug: "accident-recovery",
      icon: <LifeBuoy className="w-8 h-8" />,
      title: "Accident Recovery",
      desc: "Emergency extraction and lifting services for crash sites, roadside ditch slips, and flooded vehicles using heavy-duty wreckers and winches."
    },
    {
      slug: "roadside-assistance",
      icon: <Wrench className="w-8 h-8" />,
      title: "Roadside Assistance",
      desc: "On-the-spot breakdown fixes. Jump starts for dead batteries, tyre puncture plugging, emergency fuel delivery, and car key lockout solutions."
    },
    {
      slug: "heavy-vehicle-recovery",
      icon: <ShieldAlert className="w-8 h-8" />,
      title: "Heavy Vehicle Recovery",
      desc: "Heavy commercial towing and salvage for loaded container trucks, intercity buses, construction loaders, trailers, and public fleet vehicles."
    },
    {
      slug: "long-distance-towing",
      icon: <Compass className="w-8 h-8" />,
      title: "Long Distance Towing",
      desc: "Transporting your car to another state or city across South India? We provide double-driver setups with real-time GPS tracking and transit safety."
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

