
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate('/import',{ replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 sm:p-8">

      <div className="auth-container w-full max-w-[1480px] grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] overflow-hidden">

        {/* LEFT: LOGIN FORM */}
        <section className="auth-form-panel bg-white px-7 py-10 sm:px-10 md:px-12 lg:px-14">

          {/* Brand */}
          <Link to="/" className="auth-brand inline-block mb-9">
            <div className="auth-brand-name">
              AI PRODUCT INTELLIGENCE
            </div>
            <div className="auth-brand-title">
              Feedback Synthesis
            </div>
          </Link>

          <h1 className="auth-heading">
            Welcome Back!
          </h1>

          <p className="auth-subtitle">
            Sign in to continue analyzing customer feedback.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="auth-label"
              >
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
              <label
                htmlFor="password"
                className="auth-label"
              >
                Password *
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="auth-input"
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="auth-error"
              >
                {error}
              </div>
            )}

            {/* Remember / Forgot password row */}
            

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          <div className="auth-divider" />

          <p className="auth-footer">
            New to Feedback Synthesis?{' '}
            <Link to="/register" className="auth-link">
              Create an account
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
                  <path d="M3 3v18h18" />
                  <path d="m7 14 4-4 4 3 6-7" />
                  <path d="M17 6h4v4" />
                </svg>
              </div>
            </div>

            <h2 className="auth-info-heading">
              Your insights journey starts here
            </h2>

            <p className="auth-info-description">
              Turn customer feedback into meaningful insights.
              Understand your users, discover recurring issues,
              and make better product decisions in one place.
            </p>

            <ul className="auth-feature-list">
              <li>Analyze customer sentiment</li>
              <li>Discover recurring topics and issues</li>
              <li>Identify valuable feature requests</li>
              <li>Track customer feedback trends</li>
            </ul>

            <div className="auth-stats">
              <div>
                <strong>AI-powered</strong>
                <span>Feedback analysis</span>
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
