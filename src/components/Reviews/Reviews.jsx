import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, totalCount: 0, starsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalReviews: 0, totalPages: 1, currentPage: 1, limit: 5 });
  const [loading, setLoading] = useState(true);

  // Fetch reviews & stats from backend
  const fetchReviews = async (pageNumber = 1) => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/reviews/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Paginated Reviews
      const reviewsRes = await fetch(`/api/reviews?page=${pageNumber}&limit=5`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews);
        setPagination(reviewsData.pagination);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage(page + 1);
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < rating ? 'fill-accent text-accent' : 'text-text-muted'}
          />
        ))}
      </div>
    );
  };

  // Helper to format timestamps nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <section id="reviews" className="py-24 bg-brand-secondary/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4 relative inline-block">
            Customer Reviews
            <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-16 h-1 bg-accent rounded-full"></span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mt-6">
            Read real stories and experiences of drivers rescued by our emergency tow fleets. We verify every feedback entry.
          </p>
        </div>

        {/* Rating Metrics & Dashboard Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-center">
          
          {/* Box 1: Avg Stars */}
          <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full">
            <span className="text-6xl font-heading font-extrabold text-white mb-2">
              {stats.avgRating.toFixed(1)}
            </span>
            <div className="mb-3">{renderStars(Math.round(stats.avgRating), 24)}</div>
            <p className="text-text-secondary text-sm font-semibold">
              Average Rating out of {stats.totalCount} reviews
            </p>
          </div>

          {/* Box 2: Progress Bars Breakdown */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-3 lg:col-span-2 h-full justify-center">
            {Object.keys(stats.starsBreakdown)
              .sort((a, b) => b - a)
              .map((starNum) => {
                const count = stats.starsBreakdown[starNum];
                const percentage = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
                return (
                  <div key={starNum} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white w-3">{starNum}</span>
                    <Star size={14} className="fill-accent text-accent shrink-0" />
                    <div className="flex-1 bg-brand-primary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-accent h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-text-secondary font-medium w-8 text-right">{count}</span>
                  </div>
                );
              })}
          </div>

        </div>

        {/* Reviews List & Submission CTA split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Columns (Span 2): The Reviews Feed */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <span className="text-text-secondary text-sm">Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl">
                <p className="text-text-secondary mb-4">No approved reviews found in the database.</p>
                <p className="text-sm text-text-muted">Be the first to submit a verified experience!</p>
              </div>
            ) : (
              <>
                {reviews.map((rev) => (
                  <div key={rev.id} className="glass-panel p-8 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
                    
                    {/* Header: Name, Verified Badge, Rating, Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-heading font-bold text-white text-lg">{rev.customer_name}</h4>
                          {rev.is_verified === 1 && (
                            <span className="inline-flex items-center gap-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Verified customer
                            </span>
                          )}
                        </div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                          Vehicle Model: <span className="text-white">{rev.vehicle_model}</span>
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <div>{renderStars(rev.rating)}</div>
                        <span className="text-xs text-text-muted font-medium">{formatDate(rev.created_at)}</span>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-6 italic">
                      "{rev.review_text}"
                    </p>

                    {/* Optional Vehicle Image */}
                    {rev.photo_path && (
                      <div className="rounded-xl overflow-hidden border border-white/5 max-w-sm max-h-[220px] shadow-md group">
                        <img
                          src={rev.photo_path}
                          alt={`${rev.customer_name}'s Tow Recovery`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                  </div>
                ))}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-xs font-semibold text-text-muted uppercase">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
                      >
                        <ChevronLeft size={16} /> Prev
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={page === pagination.totalPages}
                        className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column (Span 1): Login & Review Submit CTA card */}
          <div className="glass-panel p-8 rounded-2xl sticky top-24 border border-accent/10 bg-gradient-to-b from-brand-secondary to-brand-primary">
            <h3 className="font-heading font-extrabold text-white text-xl mb-4">
              Share Your Experience
            </h3>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              We value honest customer feedback. If we helped you tow or recover your vehicle, write a review to help other drivers in need of professional assistance.
            </p>

            {user ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl mb-2 flex items-start gap-3">
                  <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-text-secondary">
                    You are logged in as <strong className="text-white">{user.name}</strong>. You can submit a review with an optional vehicle image.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-brand-primary font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-accent/10"
                >
                  Write a Review Now
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl mb-2 flex items-start gap-3">
                  <Star className="text-danger shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-text-secondary">
                    You must sign in to your verified customer account to prevent fake review submissions.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl text-sm border border-white/10 transition"
                >
                  Log In to Review
                </Link>
                <Link
                  to="/register"
                  className="text-center text-accent hover:text-accent-hover text-sm font-semibold transition"
                >
                  Create a Customer Account
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Reviews;
