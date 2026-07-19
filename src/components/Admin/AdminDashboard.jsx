import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { Shield, Users, MessageSquare, Star, CheckCircle, XCircle, Trash2, Mail, Phone, Car } from 'lucide-react';

const AdminDashboard = () => {
  const { admin, adminToken, loading } = useAuth();
  const navigate = useNavigate();

  // Selected Tab
  const [activeTab, setActiveTab] = useState('reviews'); // reviews, users, contacts

  // Datasets
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    pendingReviews: 0,
    approvedReviews: 0,
    totalUsers: 0,
    totalEnquiries: 0
  });

  // Action status message
  const [alert, setAlert] = useState({ type: null, text: '' });
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to admin login if unauthorized
  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, loading, navigate]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!adminToken) return;
    setDataLoading(true);
    try {
      // 1. Fetch Reviews
      const revRes = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const revData = await revRes.json();
      const loadedReviews = revData.reviews || [];
      setReviews(loadedReviews);

      // 2. Fetch Users
      const userRes = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const userData = await userRes.json();
      const loadedUsers = userData.users || [];
      setUsers(loadedUsers);

      // 3. Fetch Contact Enquiries
      const contactRes = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const contactData = await contactRes.json();
      const loadedContacts = contactData.messages || [];
      setContacts(loadedContacts);

      // 4. Calculate Stats
      const pending = loadedReviews.filter(r => r.is_approved === 0).length;
      const approved = loadedReviews.filter(r => r.is_approved === 1).length;

      setStats({
        pendingReviews: pending,
        approvedReviews: approved,
        totalUsers: loadedUsers.length,
        totalEnquiries: loadedContacts.length
      });

    } catch (err) {
      console.error('Error fetching admin data:', err);
      showAlert('error', 'Failed to retrieve records from the database.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadDashboardData();
    }
  }, [adminToken]);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: null, text: '' }), 4000);
  };

  // Review Operations
  const handleApproveReview = async (reviewId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        showAlert('success', 'Review approved and published.');
        loadDashboardData();
      } else {
        showAlert('error', 'Failed to approve review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        showAlert('success', 'Review status set to pending.');
        loadDashboardData();
      } else {
        showAlert('error', 'Failed to reject review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        showAlert('success', 'Review deleted successfully.');
        loadDashboardData();
      } else {
        showAlert('error', 'Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // User Operations
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Warning: Deleting this user will also delete all their reviews. Proceed?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        showAlert('success', 'User account and reviews deleted.');
        loadDashboardData();
      } else {
        showAlert('error', 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Contact Operations
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        showAlert('success', 'Enquiry record removed.');
        loadDashboardData();
      } else {
        showAlert('error', 'Failed to delete enquiry.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-primary">
        <span className="text-text-secondary">Verifying admin access...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 bg-brand-primary px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Title / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-white flex items-center gap-2">
              <Shield className="text-danger" />
              Administrative Dashboard
            </h1>
            <p className="text-text-secondary text-sm">
              Logged in as admin coordinator: <strong className="text-white">{admin.username}</strong>
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            className="bg-brand-secondary hover:bg-brand-tertiary border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-white transition cursor-pointer"
          >
            Refresh Records
          </button>
        </div>

        {/* Action Alert Banner */}
        {alert.text && (
          <div
            className={`p-4 rounded-xl border mb-6 text-sm font-semibold transition ${
              alert.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-danger/10 border-danger/20 text-danger'
            }`}
          >
            {alert.text}
          </div>
        )}

        {/* Dashboard Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Pending Reviews</span>
            <span className="text-3xl font-bold text-accent">{stats.pendingReviews}</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Approved Reviews</span>
            <span className="text-3xl font-bold text-green-400">{stats.approvedReviews}</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Registered Clients</span>
            <span className="text-3xl font-bold text-white">{stats.totalUsers}</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Towing Enquiries</span>
            <span className="text-3xl font-bold text-white">{stats.totalEnquiries}</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-white/5 gap-6 mb-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 border-b-2 transition cursor-pointer ${
              activeTab === 'reviews' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            Manage Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 border-b-2 transition cursor-pointer ${
              activeTab === 'users' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            Manage Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-4 border-b-2 transition cursor-pointer ${
              activeTab === 'contacts' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            Towing Enquiries ({contacts.length})
          </button>
        </div>

        {/* Tab Contents */}
        {dataLoading ? (
          <div className="text-center py-12">
            <span className="text-text-secondary">Loading dashboard data...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* TAB 1: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-text-secondary text-sm">No review feedback found.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 border border-white/5">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-bold text-white">{rev.customer_name}</span>
                          <span className="text-xs text-text-muted">({rev.customer_email})</span>
                          <span className="text-xs text-accent font-semibold uppercase tracking-wider">
                            🚘 {rev.vehicle_model}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            rev.is_approved === 1 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-accent/10 text-accent border border-accent/20'
                          }`}>
                            {rev.is_approved === 1 ? 'Approved / Public' : 'Pending Verification'}
                          </span>
                        </div>

                        {/* Stars & Date */}
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex text-accent">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={14} className={i < rev.rating ? 'fill-accent' : 'text-text-muted'} />
                            ))}
                          </div>
                          <span className="text-text-muted">{formatDate(rev.created_at)}</span>
                        </div>

                        {/* Review text */}
                        <p className="text-text-secondary text-sm leading-relaxed italic">
                          "{rev.review_text}"
                        </p>

                        {/* Uploaded Photo Link */}
                        {rev.photo_path && (
                          <div className="max-w-[120px] rounded-lg overflow-hidden border border-white/5 shadow">
                            <img src={rev.photo_path.startsWith('http') ? rev.photo_path : `${API_BASE_URL}${rev.photo_path}`} alt="Review vehicle attachment" className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Operations */}
                      <div className="flex md:flex-col items-center justify-end gap-3 shrink-0">
                        {rev.is_approved === 0 ? (
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRejectReview(rev.id)}
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="flex items-center gap-1.5 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-brand-secondary border-b border-white/5 text-text-muted font-bold text-xs uppercase tracking-wider">
                        <th className="px-6 py-4">Client Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Registered Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-text-secondary">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                            No registered customers found.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-brand-secondary/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                              {u.name}
                              {u.is_verified === 1 && <span className="text-accent">★</span>}
                            </td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4">{u.phone}</td>
                            <td className="px-6 py-4">{formatDate(u.created_at)}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-danger hover:text-danger-hover p-2 rounded-lg hover:bg-danger/10 transition cursor-pointer"
                                title="Delete Client"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CONTACT ENQUIRIES */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-text-secondary text-sm">No customer contact enquiries found.</p>
                ) : (
                  contacts.map((msg) => (
                    <div key={msg.id} className="glass-panel p-6 rounded-2xl border border-white/5 relative hover:border-white/10 transition">
                      <button
                        onClick={() => handleDeleteContact(msg.id)}
                        className="absolute top-6 right-6 text-text-muted hover:text-danger transition cursor-pointer"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white">
                          <span>{msg.name}</span>
                          <span className="flex items-center gap-1 text-xs text-text-secondary font-medium">
                            <Phone size={12} className="text-accent" /> {msg.phone}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-secondary font-medium">
                            <Car size={12} className="text-accent" /> {msg.vehicle}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm bg-brand-primary/50 p-4 rounded-xl border border-white/5 leading-relaxed font-mono">
                          {msg.message}
                        </p>
                        <div className="text-xs text-text-muted font-medium">
                          Submitted: {formatDate(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
};

export default AdminDashboard;
