export function ResetFlow({
  styles,
  step,
  loading,
  resetData,
  setResetData,
  onInit,
  onComplete,
  onBack
}) {
  if (step === 'forgot-reset') {
    return (
      <form className={styles.form} onSubmit={onComplete}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Identifier (Email/Mobile)</label>
          <input
            type="text"
            required
            className={styles.input}
            value={resetData.identifier}
            onChange={(e) => setResetData({ ...resetData, identifier: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>OTP</label>
          <input
            type="text"
            required
            className={styles.input}
            value={resetData.otp}
            onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            required
            className={styles.input}
            value={resetData.newPassword}
            onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            required
            className={styles.input}
            value={resetData.confirmPassword}
            onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
          />
        </div>

        <div className={styles.row}>
          <button type="button" className={styles.secondaryButton} onClick={onBack}>
            Back
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
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
          value={resetData.identifier}
          onChange={(e) => setResetData({ ...resetData, identifier: e.target.value })}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
}
