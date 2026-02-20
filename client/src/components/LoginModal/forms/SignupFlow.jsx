export function SignupFlow({
  styles,
  step,
  loading,
  signupData,
  setSignupData,
  onInit,
  onVerifyOtp,
  onComplete,
  onBackToDefault,
  onBackToOtp
}) {
  if (step === 'signup-verify-otp') {
    return (
      <form className={styles.form} onSubmit={onVerifyOtp}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Identifier (Email/Mobile)</label>
          <input
            type="text"
            required
            className={styles.input}
            value={signupData.identifier}
            onChange={(e) => setSignupData({ ...signupData, identifier: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>OTP</label>
          <input
            type="text"
            required
            className={styles.input}
            placeholder="Enter OTP"
            value={signupData.otp}
            onChange={(e) => setSignupData({ ...signupData, otp: e.target.value })}
          />
        </div>

        <div className={styles.row}>
          <button type="button" className={styles.secondaryButton} onClick={onBackToDefault}>
            Back
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>
    );
  }

  if (step === 'signup-complete') {
    return (
      <form className={styles.form} onSubmit={onComplete}>
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            required
            className={styles.input}
            placeholder="Enter first name"
            value={signupData.firstName}
            onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter last name"
            value={signupData.lastName}
            onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Create password"
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
            placeholder="Confirm password"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
          />
        </div>

        <div className={styles.row}>
          <button type="button" className={styles.secondaryButton} onClick={onBackToOtp}>
            Back
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={onInit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Email/Mobile</label>
        <input
          type="text"
          required
          className={styles.input}
          placeholder="Enter email or mobile"
          value={signupData.identifier}
          onChange={(e) => setSignupData({ ...signupData, identifier: e.target.value })}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
}
