import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ContactSection from './components/ContactSection';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews/Reviews';
import ContactForm from './components/ContactForm';

// Import Pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import UserProfile from './components/Profile/UserProfile';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ServiceDetail from './components/ServiceDetail';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';

// Import Icons
import { Phone, MessageSquare } from 'lucide-react';

// Landing Page Section Aggregator
const Home = () => {
  return (
    <>
      <SEO 
        title="Annamalaiyar Recovery & Towing | 24/7 Car Towing Service in Madurai"
        description="24/7 car towing, bike towing, accident recovery and roadside assistance in Madurai. Fast, reliable and professional towing services. Call +91 95855 87999."
      />
      <Hero />
      <ContactSection />
      <Services />
      <WhyChooseUs />
      <Gallery />
      <Reviews />
      <ContactForm />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-brand-primary text-white">
          {/* Header Navbar Navigation */}
          <Navbar />

          {/* Router Content Pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/:serviceSlug" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>

          {/* Footer details */}
          <Footer />

          {/* Floating Action Helpline Buttons (Always visible globally) */}
          <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
            {/* WhatsApp Coordinator */}
            <a
              href="https://wa.me/919585587999?text=Hello,%20I%20need%20emergency%20towing%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-[#25d366] hover:bg-[#1fba57] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition duration-300 group"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={26} className="fill-white text-[#25d366]" />
            </a>

            {/* Direct Dial Helpline */}
            <a
              href="tel:+919585587999"
              className="w-14 h-14 bg-danger hover:bg-danger-hover text-white rounded-full flex items-center justify-center shadow-lg animate-pulse-soft hover:scale-110 transition duration-300"
              title="Call Helpline Directly"
            >
              <Phone size={24} className="fill-white text-danger" />
            </a>
          </div>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
