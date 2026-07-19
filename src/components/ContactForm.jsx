import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: null, text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.vehicle || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill in all the contact form fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: data.message });
        setFormData({ name: '', phone: '', vehicle: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus({ type: 'error', text: 'Server error. Please try calling directly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-secondary/20 border-b border-white/5 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
            Send Us an Enquiry
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Have a question about our pricing, flatbed transport, or long-distance services? Submit your details and our team will get back to you.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-8 md:p-12 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Alert Status Banner */}
            {status.text && (
              <div
                className={`p-4 rounded-xl flex items-start gap-3 border ${
                  status.type === 'success'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-danger/10 border-danger/20 text-danger'
                }`}
              >
                {status.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                <p className="text-sm font-medium">{status.text}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Annamalai"
                  className="bg-brand-primary input-field rounded-xl px-4 py-3.5 text-white placeholder:text-text-muted"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 95855 87999"
                  className="bg-brand-primary input-field rounded-xl px-4 py-3.5 text-white placeholder:text-text-muted"
                  required
                />
              </div>

            </div>

            {/* Vehicle details */}
            <div className="flex flex-col gap-2">
              <label htmlFor="vehicle" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Vehicle Model & Make
              </label>
              <input
                type="text"
                id="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="e.g. Maruti Swift (2022) / Royal Enfield Bullet"
                className="bg-brand-primary input-field rounded-xl px-4 py-3.5 text-white placeholder:text-text-muted"
                required
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Enquiry Details / Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your request (e.g., I need a flatbed quotation from Madurai Melamadai to Chennai...)"
                className="bg-brand-primary input-field rounded-xl px-4 py-3.5 text-white placeholder:text-text-muted resize-none"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-primary font-bold py-4 rounded-xl shadow-lg shadow-accent/15 cursor-pointer transition-all duration-200"
            >
              {loading ? (
                <span>Submitting Enquiry...</span>
              ) : (
                <>
                  <Send size={18} />
                  Submit Enquiry Message
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactForm;
