import React, { useState } from 'react';
import Styles from './AdminLoginPage.module.css';

const AdminLoginPage = () => {
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation for mobile number (10 digits Indian format)
  const isValidMobile = (num) => /^[6-9]\d{9}$/.test(num);
  
  // Demo credentials - in real app, check with backend
  const isValidCredentials = (mobileNum, pwd) => {
    // Demo: mobile: 9876543210, password: admin123
    return mobileNum === '9876543210' && pwd === 'admin123';
  };

  // Generate random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle login with Mobile & Password
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }
    if (!isValidMobile(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isValidCredentials(mobile, password)) {
        const newOtp = generateOTP();
        console.log(`OTP for ${mobile}: ${newOtp}`);
        alert(`Demo OTP: ${newOtp}\n(For testing, you can also use: 123456)`);
        
        setStep('otp');
        setError('');
      } else {
        setError('Invalid credentials! Demo: Mobile: 9876543210, Password: admin123');
      }
      setIsLoading(false);
    }, 800);
  };

  // Handle OTP verification
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Demo OTP: 123456
      if (otp === '123456') {
        alert('✅ Login Successful! Redirecting to Admin Dashboard...');
        // Here you can:
        // - Set authentication token in localStorage/context
        // - Redirect to dashboard using useNavigate
        // window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid OTP! Demo OTP: 123456');
      }
      setIsLoading(false);
    }, 800);
  };

  // Resend OTP
  const handleResendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newOtp = generateOTP();
      console.log(`New OTP: ${newOtp}`);
      alert(`New Demo OTP: ${newOtp}\n(Or use 123456 for testing)`);
      setIsLoading(false);
    }, 500);
  };

  // Go back to credentials step
  const handleBackToLogin = () => {
    setStep('credentials');
    setOtp('');
    setError('');
  };

  return (
    <div className={Styles.container}>
      {/* Left side - Image Section */}
      <div className={Styles.imageSection}>
        <div className={Styles.imageOverlay}>
          <div className={Styles.brandContent}>
            <div className={Styles.shieldIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 12L5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 12L19 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2>Admin Portal</h2>
            <p>Secure access with two-factor authentication</p>
            <div className={Styles.securityBadge}>
              <span>🔐 256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form Section */}
      <div className={Styles.formSection}>
        <div className={Styles.formWrapper}>
          <div className={Styles.formHeader}>
            <h1>Welcome back</h1>
            <p>Admin authentication required</p>
          </div>

          {step === 'credentials' ? (
            // Step 1: Mobile Number & Password Form
            <form onSubmit={handleCredentialSubmit} className={Styles.loginForm}>
              <div className={Styles.inputGroup}>
                <label htmlFor="mobile">Mobile Number</label>
                <div className={Styles.inputIconWrapper}>
                  <span className={Styles.inputIcon}>📱</span>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    autoComplete="off"
                    className={error && !mobile ? Styles.errorInput : ''}
                  />
                </div>
              </div>

              <div className={Styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={Styles.inputIconWrapper}>
                  <span className={Styles.inputIcon}>🔒</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && <div className={Styles.errorMessage}>{error}</div>}

              <button type="submit" className={Styles.loginBtn} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Send OTP →'}
              </button>

              <div className={Styles.securityNote}>
                <span>⚠️ Demo credentials: 9876543210 / admin123</span>
              </div>
            </form>
          ) : (
            // Step 2: OTP Verification Form
            <form onSubmit={handleOtpSubmit} className={Styles.loginForm}>
              <div className={Styles.otpInfo}>
                <div className={Styles.mobileVerified}>
                  <span>✅ Verifying for</span>
                  <strong>{mobile}</strong>
                </div>
                <p className={Styles.otpInstruction}>
                  Enter the 6-digit OTP sent to your registered mobile number
                </p>
              </div>

              <div className={Styles.inputGroup}>
                <label htmlFor="otp">One-Time Password (OTP)</label>
                <div className={Styles.inputIconWrapper}>
                  <span className={Styles.inputIcon}>✉️</span>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength="6"
                    autoComplete="off"
                  />
                </div>
              </div>

              {error && <div className={Styles.errorMessage}>{error}</div>}

              <button type="submit" className={Styles.loginBtn} disabled={isLoading}>
                {isLoading ? 'Verifying OTP...' : 'Verify OTP & Login'}
              </button>

              <div className={Styles.otpActions}>
                <button type="button" onClick={handleBackToLogin} className={Styles.textBtn}>
                  ← Back to login
                </button>
                <button type="button" onClick={handleResendOtp} className={`${Styles.textBtn} ${Styles.resendBtn}`}>
                  Resend OTP
                </button>
              </div>

              <div className={Styles.demoNote}>
                <span>🔑 Demo OTP: 123456</span>
              </div>
            </form>
          )}

          <div className={Styles.footerNote}>
            <p>🔒 Multi-layer security • Session encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;