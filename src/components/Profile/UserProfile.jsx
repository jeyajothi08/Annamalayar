import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { Star, CheckCircle2, AlertCircle, Upload, FileImage, Sparkles } from 'lucide-react';
import SEO from '../SEO';

const UserProfile = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  // Review Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [vehicleModel, setVehicleModel] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Submit Feedback States
  const [status, setStatus] = useState({ type: null, text: '' });
  const [formLoading, setFormLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-primary">
        <span className="text-text-secondary">Loading your profile...</span>
      </div>
    );
  }

  // Handle Photo input select
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: 'error', text: 'Image file size is too large (max 5MB).' });
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Submit Review Form
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!vehicleModel || !reviewText) {
      setStatus({ type: 'error', text: 'Please fill in the vehicle model and review text.' });
      return;
    }

    setFormLoading(true);
    setStatus({ type: null, text: '' });

    // Construct Multipart Form Data
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('vehicleModel', vehicleModel);
    formData.append('reviewText', reviewText);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: data.message });
        // Clear Form
        setVehicleModel('');
        setReviewText('');
        setPhoto(null);
        setPhotoPreview('');
        setRating(5);
      } else {
        setStatus({ type: 'error', text: data.message || 'Submission failed.' });
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setStatus({ type: 'error', text: 'Failed to submit review due to connection error.' });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 bg-brand-primary px-4 md:px-8">
      <SEO 
        title="My Profile | Annamalaiyar Recovery & Towing"
        description="View and update your customer account profile, review booking history, and manage roadside assistance bookings."
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Account Details */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-accent/10 border border-accent/25 rounded-full flex items-center justify-center text-accent text-3xl font-bold font-heading mb-6 shadow-md shadow-accent/5">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h3 className="font-heading font-extrabold text-white text-xl flex items-center gap-1.5 justify-center mb-1">
            {user.name}
            {user.is_verified === 1 && (
              <span className="text-accent" title="Verified Customer">
                <CheckCircle2 size={18} />
              </span>
            )}
          </h3>
          
          <p className="text-text-secondary text-sm mb-6">{user.email}</p>
          
          <div className="w-full h-px bg-white/5 mb-6"></div>

          <div className="w-full text-left space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary font-medium">Phone Contact</span>
              <span className="text-white font-semibold">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary font-medium">Customer Status</span>
              <span className="text-accent font-bold uppercase tracking-wider text-xs">
                {user.is_verified === 1 ? 'Verified Client' : 'Standard Account'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns (Span 2): Submit Feedback Review Form */}
        <div className="lg:col-span-2 glass-panel p-8 md:p-10 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={24} className="text-accent" />
            <h2 className="text-2xl font-heading font-extrabold text-white">
              Write a Towing & Assistance Review
            </h2>
          </div>
          
          <p className="text-text-secondary text-sm mb-8">
            Tell us about your recovery or towing service. Approved reviews are displayed publicly on our testimonials feed.
          </p>

          {/* Form Status Alert */}
          {status.text && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 border mb-6 ${
                status.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-danger/10 border-danger/20 text-danger'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
              <span className="text-sm font-medium">{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-6">
            
            {/* Rating Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Overall Service Rating
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        starVal <= (hoverRating || rating)
                          ? 'fill-accent text-accent'
                          : 'text-text-muted'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle details */}
            <div className="flex flex-col gap-2">
              <label htmlFor="vehicleModel" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Your Vehicle Model
              </label>
              <input
                type="text"
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Maruti Suzuki Swift / Honda Activa"
                className="w-full bg-brand-secondary input-field rounded-xl px-4 py-3.5 text-white placeholder:text-text-muted"
                required
              />
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reviewText" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Your Testimonial Review Message
              </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                placeholder="Describe your roadside experience. E.g., The flatbed driver arrived in 20 minutes, handled the keys professionally, and towed my vehicle damage-free to Vandiyur..."
                className="w-full bg-brand-secondary input-field rounded-xl px-4 py-3.5 text-white placeholder:text-text-muted resize-none"
                required
              ></textarea>
            </div>

            {/* Photo Uploader */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Upload Vehicle Image (Optional)
              </span>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                
                {/* Drag-drop wrapper */}
                <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-accent/40 rounded-2xl py-8 px-4 cursor-pointer transition bg-brand-secondary/40">
                  <Upload size={32} className="text-text-secondary mb-3" />
                  <span className="text-sm font-semibold text-white mb-1">Click to Upload File</span>
                  <span className="text-xs text-text-muted">JPEG, PNG, or WEBP up to 5MB</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>

                {/* Preview panel */}
                {photoPreview ? (
                  <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden border border-white/5 relative bg-brand-secondary flex items-center justify-center">
                    <img
                      src={photoPreview}
                      alt="Vehicle Upload Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview('');
                      }}
                      className="absolute top-2 right-2 bg-black/75 hover:bg-black text-white p-1.5 rounded-full text-xs"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:flex w-48 aspect-square rounded-2xl border border-dashed border-white/5 bg-brand-secondary/20 flex-col items-center justify-center text-text-muted">
                    <FileImage size={24} />
                    <span className="text-xs mt-2">No Photo Selected</span>
                  </div>
                )}

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-primary font-bold py-4 rounded-xl shadow-lg shadow-accent/15 cursor-pointer transition-all duration-200"
            >
              {formLoading ? (
                <span>Submitting feedback...</span>
              ) : (
                <span>Submit Review for Verification</span>
              )}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
};

export default UserProfile;
