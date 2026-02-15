import { useState, useEffect } from 'react';
import { X, Eye as EyeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginModal.module.css';

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   defaultTab?: 'login' | 'signup';
// }

export function LoginModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setLoginData({ email: '', password: '' });
      setSignupData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password
      });
      onClose();
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.logo}>
            <EyeIcon className={styles.logoIcon} />
          </div>
          <h2 className={styles.title}>Welcome to Technoii</h2>
          <p className={styles.subtitle}>
            {activeTab === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setError('');
              }}
            >
              Sign Up
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {activeTab === 'login' ? (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <div className={styles.forgotPassword}>
                <span className={styles.forgotLink}>Forgot Password?</span>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleSignup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Enter your name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone (Optional)</label>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Enter your phone number"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <span className={styles.footerLink} onClick={() => setActiveTab('signup')}>
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span className={styles.footerLink} onClick={() => setActiveTab('login')}>
                Sign in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
