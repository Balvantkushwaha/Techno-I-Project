import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthForm } from '../../hooks/useAuth';
import OTPVerification from './OTPVerification';
import ResetPassword from './ResetPassword';
import '../../styles/auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { formData, errors, loading, setLoading, authError, handleChange, validateForm } = useAuthForm({
    identifier: ''
  });

  const [step, setStep] = useState('email'); // email, verify, reset
  const [localError, setLocalError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm(['identifier'])) {
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(formData.identifier);
      setStep('verify');
    } catch (error) {
      setLocalError(error.message || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setStep('reset');
  };

  if (step === 'verify') {
    return (
      <OTPVerification
        identifier={formData.identifier}
        onVerify={handleVerifyOTP}
        onBack={() => setStep('email')}
        type="forgot-password"
      />
    );
  }

  if (step === 'reset') {
    return (
      <ResetPassword 
        identifier={formData.identifier}
        onBack={() => setStep('verify')}
      />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password</p>
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
            {loading ? 'Sending OTP...' : 'Send Reset OTP'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;