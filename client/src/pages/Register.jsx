
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Product Manager'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      await api.post('/auth/register', form);

      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="auth-container w-full max-w-[1480px] grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] overflow-hidden">

        {/* LEFT: REGISTRATION FORM */}
        <section className="auth-form-panel bg-white px-7 py-8 sm:px-10 md:px-12 lg:px-14">

          {/* Brand */}
          <Link to="/" className="auth-brand inline-block mb-7">
            <div className="auth-brand-name">
              AI PRODUCT INTELLIGENCE
            </div>
            <div className="auth-brand-title">
              Feedback Synthesis
            </div>
          </Link>

          <h1 className="auth-heading">
            Create Account
          </h1>

          <p className="auth-subtitle">
            Start turning customer feedback into meaningful product insights.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="auth-label">
                Full Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="auth-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="auth-label">
                Email Address *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                required
                className="auth-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="auth-label">
                Password *
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
                className="auth-input"
              />

              <p className="mt-2 text-xs text-gray-500">
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="auth-label">
                Role *
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="auth-input"
              >
                <option value="Admin">Admin</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Support Manager">Support Manager</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="auth-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          <div className="auth-divider" />

          <p className="auth-footer">
            Already registered?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>

          <Link to="/" className="auth-back-link">
            ← Back to Homepage
          </Link>
        </section>

        {/* RIGHT: LAVENDER INFORMATION PANEL */}
        <section className="auth-info-panel">

          <div className="auth-info-content">
            <div className="auth-illustration" aria-hidden="true">
              <div className="auth-illustration-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="42"
                  height="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                  <path d="M3 20h18" />
                </svg>
              </div>
            </div>

            <h2 className="auth-info-heading">
              Your product intelligence journey starts here
            </h2>

            <p className="auth-info-description">
              Create your account and discover how customer feedback
              can reveal product opportunities, recurring issues,
              and valuable improvements.
            </p>

            <ul className="auth-feature-list">
              <li>Understand customer sentiment</li>
              <li>Discover recurring topics and issues</li>
              <li>Identify and organize feature requests</li>
              <li>Explore product feedback trends</li>
            </ul>

            <div className="auth-stats">
              <div>
                <strong>AI-powered</strong>
                <span>Analysis</span>
              </div>

              <div>
                <strong>Multi-product</strong>
                <span>Insights</span>
              </div>

              <div>
                <strong>Actionable</strong>
                <span>Reports</span>
              </div>
            </div>
          </div>

          <div className="auth-panel-decoration auth-decoration-one" />
          <div className="auth-panel-decoration auth-decoration-two" />

        </section>
      </div>
    </div>
  );
}
