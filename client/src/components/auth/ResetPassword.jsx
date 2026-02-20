import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthForm } from '../../hooks/useAuth';
import '../../styles/auth.css';

const ResetPassword = ({ identifier, onBack }) => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { formData, errors, loading, setLoading, authError, handleChange, validateForm } = useAuthForm({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    if (!validateForm(['otp', 'newPassword', 'confirmPassword'])) {
      return;
    }

    setLoading(true);
    try {
      const resetData = {
        identifier,
        otp: formData.otp,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
      
      await resetPassword(resetData);
      setSuccess('Password updated successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setLocalError(error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>

        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter the OTP and your new password</p>
        </div>

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        {(localError || authError) && (
          <div className="auth-error">
            {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className={errors.otp ? 'error' : ''}
              disabled={loading}
              required
            />
            {errors.otp && (
              <span className="error-message">{errors.otp}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className={errors.newPassword ? 'error' : ''}
              disabled={loading}
              required
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
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
              placeholder="Confirm new password"
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;