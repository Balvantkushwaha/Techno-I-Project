import { useEffect, useState } from 'react';
import { Eye as EyeIcon, X } from 'lucide-react';
import { authApi, getErrorMessage } from './api/authApi';
import { LoginFlow } from './forms/LoginFlow';
import { ResetFlow } from './forms/ResetFlow';
import { SignupFlow } from './forms/SignupFlow';
import styles from './LoginModal.module.css';

const initialLoginData = {
  identifier: '',
  password: '',
  otp: ''
};

const initialSignupData = {
  identifier: '',
  otp: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: ''
};

const initialResetData = {
  identifier: '',
  otp: '',
  newPassword: '',
  confirmPassword: ''
};

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const fullName = [rawUser.firstName, rawUser.lastName].filter(Boolean).join(' ').trim();

  return {
    id: rawUser._id || rawUser.id || rawUser.userId || '',
    name: fullName || rawUser.name || rawUser.email || rawUser.mobile || 'User',
    email: rawUser.email || '',
    phone: rawUser.mobile || rawUser.phone || '',
    avatar: null
  };
};

const persistUser = (rawUser) => {
  const user = normalizeUser(rawUser);
  if (!user) return;

  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
};

export function LoginModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [step, setStep] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('password');

  const [loginData, setLoginData] = useState(initialLoginData);
  const [signupData, setSignupData] = useState(initialSignupData);
  const [resetData, setResetData] = useState(initialResetData);

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setStep('default');
    clearMessages();
    if (tab !== 'login') {
      setLoginMethod('password');
    }
  };

  const fetchProfileAndPersist = async () => {
    try {
      const profile = await authApi.getProfile();
      persistUser(profile?.data);
    } catch {
      // ignore profile fetch failure after successful auth response
    }
  };

  const completeAuth = async (userFromResponse) => {
    if (userFromResponse) {
      persistUser(userFromResponse);
    }
    await fetchProfileAndPersist();
    onClose();
    window.location.reload();
  };

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!isOpen) {
      setStep('default');
      setLoading(false);
      setError('');
      setMessage('');
      setLoginMethod('password');
      setLoginData(initialLoginData);
      setSignupData(initialSignupData);
      setResetData(initialResetData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    clearMessages();
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (loginMethod === 'password') {
        const response = await authApi.loginWithPassword(loginData.identifier, loginData.password);
        await completeAuth(response?.data);
        return;
      }

      await authApi.requestLoginOtp(loginData.identifier);
      setStep('login-otp');
      setMessage('OTP sent for login. Please verify OTP.');
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOtpVerify = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await authApi.verifyLoginOtp(loginData.identifier, loginData.otp);
      await completeAuth(response?.data);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await authApi.initRegister(signupData.identifier);
      setStep('signup-verify-otp');
      setMessage('OTP sent. Verify OTP to continue registration.');
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerifyOtp = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await authApi.verifyRegisterOtp(signupData.identifier, signupData.otp);
      setStep('signup-complete');
      setMessage('OTP verified. Complete your profile details.');
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupComplete = async (event) => {
    event.preventDefault();
    clearMessages();

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
      const response = await authApi.completeRegister({
        identifier: signupData.identifier,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword
      });
      await completeAuth(response?.user);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleResetInit = async (event) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await authApi.forgetPassword(resetData.identifier);
      setStep('forgot-reset');
      setMessage('Password reset OTP sent. Enter OTP and new password.');
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleResetComplete = async (event) => {
    event.preventDefault();
    clearMessages();

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        identifier: resetData.identifier,
        otp: resetData.otp,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword
      });

      setMessage('Password updated successfully. Please login now.');
      setActiveTab('login');
      setStep('default');
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const renderFlow = () => {
    if (activeTab === 'login') {
      return (
        <LoginFlow
          styles={styles}
          step={step}
          loading={loading}
          loginMethod={loginMethod}
          loginData={loginData}
          setLoginData={setLoginData}
          onMethodChange={handleLoginMethodChange}
          onSubmitLogin={handleLoginSubmit}
          onVerifyOtp={handleLoginOtpVerify}
          onBack={() => setStep('default')}
          onForgotPassword={() => switchTab('reset')}
        />
      );
    }

    if (activeTab === 'signup') {
      return (
        <SignupFlow
          styles={styles}
          step={step}
          loading={loading}
          signupData={signupData}
          setSignupData={setSignupData}
          onInit={handleSignupInit}
          onVerifyOtp={handleSignupVerifyOtp}
          onComplete={handleSignupComplete}
          onBackToDefault={() => setStep('default')}
          onBackToOtp={() => setStep('signup-verify-otp')}
        />
      );
    }

    return (
      <ResetFlow
        styles={styles}
        step={step}
        loading={loading}
        resetData={resetData}
        setResetData={setResetData}
        onInit={handleResetInit}
        onComplete={handleResetComplete}
        onBack={() => setStep('default')}
      />
    );
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
            {activeTab === 'login'
              ? 'Sign in to continue'
              : activeTab === 'signup'
                ? 'Create your account with OTP verification'
                : 'Reset your account password'}
          </p>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={() => switchTab('login')}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </button>
            {/* <button
              className={`${styles.tab} ${activeTab === 'reset' ? styles.tabActive : ''}`}
              onClick={() => switchTab('reset')}
            >
              Reset
            </button> */}
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.info}>{message}</div>}

          {renderFlow()}

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine} />
          </div>
{/* 
          <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div> */}

          
        </div>

        <div className={styles.footer}>
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <span className={styles.footerLink} onClick={() => switchTab('signup')}>
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span className={styles.footerLink} onClick={() => switchTab('login')}>
                Sign in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
