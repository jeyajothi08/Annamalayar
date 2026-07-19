import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const [lightboxImg, setLightboxImg] = useState(null);

  const galleryImages = [
    {
      src: "https://content3.jdmagicbox.com/comp/madurai/v7/0452px452.x452.240509130921.k5v7/catalogue/annamalaiyar-recovery-and-towing-service-melamadai-madurai-car-towing-services-zq74v9mwt1.jpg",
      title: "Accident Recovery Operations"
    },
    {
      src: "https://content3.jdmagicbox.com/v2/comp/madurai/v7/0452px452.x452.240509130921.k5v7/catalogue/annamalaiyar-recovery-and-towing-service-melamadai-madurai-car-towing-services-482lo41otf.jpg",
      title: "Flatbed Car Towing Truck"
    },
    {
      src: "https://content3.jdmagicbox.com/v2/comp/madurai/v7/0452px452.x452.240509130921.k5v7/catalogue/annamalaiyar-recovery-and-towing-service-melamadai-madurai-car-towing-services-pxhecrr7fi.jpg",
      title: "Wheel Lift Vehicle Loader"
    },
    {
      src: "https://content3.jdmagicbox.com/v2/comp/madurai/v7/0452px452.x452.240509130921.k5v7/catalogue/annamalaiyar-recovery-and-towing-service-melamadai-madurai-car-towing-services-rn2gkmbqve.jpg",
      title: "Roadside Winch Assistance"
    },
    {
      src: "https://content3.jdmagicbox.com/v2/comp/madurai/v7/0452px452.x452.240509130921.k5v7/catalogue/annamalaiyar-recovery-and-towing-service-melamadai-madurai-car-towing-services-syeif0w1lb.jpg",
      title: "Heavy Tow Crane Fleet"
    },
    {
      src: "/towing-hero.png",
      title: "Emergency Road Rescue Setup"
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-brand-primary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 relative inline-block">
            Our Recovery Fleet in Action
            <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-6">
            Take a look at our professional fleet of flatbeds, tow cranes, and roadside assistance setups handling local vehicle retrievals.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              onClick={() => setLightboxImg(img.src)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 shadow-lg group cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <ZoomIn className="text-accent mb-2" size={24} />
                <span className="text-white font-heading font-bold text-base leading-tight">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal Dialog */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 text-white hover:text-accent transition-colors bg-white/5 hover:bg-white/10 p-2.5 rounded-full cursor-pointer"
          >
            <X size={24} />
          </button>
          
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Enlarged Recovery Work"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
