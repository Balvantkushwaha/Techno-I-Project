import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthForm } from '../../hooks/useAuth';
import OTPVerification from './OTPVerification';
import '../../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyLoginOTP } = useAuth();
  const { formData, errors, loading, setLoading, authError, handleChange, validateForm } = useAuthForm({
    identifier: '',
    password: '',
    loginMethod: 'password'
  });

  const [loginMethod, setLoginMethod] = useState('password');
  const [showOTP, setShowOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm(['identifier'])) {
      return;
    }

    setLoading(true);
    try {
      const credentials = {
        identifier: formData.identifier,
        loginMethod
      };

      if (loginMethod === 'password') {
        if (!formData.password) {
          setLocalError('Password is required');
          setLoading(false);
          return;
        }
        credentials.password = formData.password;
      }

      const response = await login(credentials);
      
      if (loginMethod === 'otp' && response.requiresOTP) {
        setOtpSent(true);
        setShowOTP(true);
      } else if (response.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      setLocalError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp) => {
    setLoading(true);
    try {
      const response = await verifyLoginOTP(formData.identifier, otp);
      if (response.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      setLocalError(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'password' ? 'otp' : 'password');
    setOtpSent(false);
    setShowOTP(false);
    setLocalError('');
  };

  if (showOTP) {
    return (
      <OTPVerification
        identifier={formData.identifier}
        onVerify={handleOTPVerify}
        onBack={() => setShowOTP(false)}
        type="login"
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to continue</p>
        </div>

        {(localError || authError) && (
          <div className="auth-error">
            {localError || authError}
          </div>
        )}

        {otpSent && (
          <div className="auth-success">
            OTP has been sent to your email
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="identifier">Email/Mobile</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or mobile number    "
              className={errors.identifier ? 'error' : ''}
              disabled={loading}
              required
            />
            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          {loginMethod === 'password' && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : loginMethod === 'password' ? 'Sign In' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            onClick={toggleLoginMethod} 
            className="link-button"
            disabled={loading}
          >
            {loginMethod === 'password' 
              ? 'Login with OTP instead' 
              : 'Login with password instead'}
          </button>
        </div>

        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
          <Link to="/signup" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;