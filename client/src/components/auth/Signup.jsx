import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthForm } from '../../hooks/useAuth';
import OTPVerification from './OTPVerification';
import '../../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { formData, errors, loading, setLoading, authError, handleChange, validateForm } = useAuthForm({
    identifier: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const [step, setStep] = useState('init'); // init, verify, complete
  const [localError, setLocalError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm(['identifier'])) {
      return;
    }

    setLoading(true);
    try {
      const response = await register.sendOTP(formData.identifier);
      setStep('verify');
    } catch (error) {
      setLocalError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    try {
      await register.verifyOTP(formData.identifier, otp);
      setStep('complete');
    } catch (error) {
      setLocalError(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm(['firstName', 'lastName', 'password', 'confirmPassword'])) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        identifier: formData.identifier,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };
      
      const response = await register.complete(userData);
      if (response.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      setLocalError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <OTPVerification
        identifier={formData.identifier}
        onVerify={handleVerifyOTP}
        onBack={() => setStep('init')}
        type="register"
      />
    );
  }

  if (step === 'complete') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Complete Registration</h2>
            <p>Please provide your details</p>
          </div>

          {(localError || authError) && (
            <div className="auth-error">
              {localError || authError}
            </div>
          )}

          <form onSubmit={handleCompleteRegistration} className="auth-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={errors.firstName ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={errors.lastName ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Enter your email to get started</p>
        </div>

        {(localError || authError) && (
          <div className="auth-error">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSendOTP} className="auth-form">
          <div className="form-group">
            <label htmlFor="identifier">Email</label>
            <input
              type="email"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.identifier ? 'error' : ''}
              disabled={loading}
              required
            />
            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;