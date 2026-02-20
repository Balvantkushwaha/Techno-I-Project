export function LoginFlow({
  styles,
  step,
  loading,
  loginMethod,
  loginData,
  setLoginData,
  onMethodChange,
  onSubmitLogin,
  onVerifyOtp,
  onBack,
  onForgotPassword,
}) {
  if (step === "login-otp") {
    return (
      <form className={styles.form} onSubmit={onVerifyOtp}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Identifier (Email/Mobile)</label>
          <input
            type="text"
            required
            className={styles.input}
            placeholder="Enter email or mobile"
            value={loginData.identifier}
            onChange={(e) =>
              setLoginData({ ...loginData, identifier: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>OTP</label>
          <input
            type="text"
            required
            className={styles.input}
            placeholder="Enter OTP"
            value={loginData.otp}
            onChange={(e) =>
              setLoginData({ ...loginData, otp: e.target.value })
            }
          />
        </div>

        <div className={styles.row}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP & Login"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmitLogin}>
     
      <div className={styles.formGroup}>
        <label className={styles.label}>Email/Mobile</label>
        <input
          type="text"
          required
          className={styles.input}
          placeholder="Enter email or mobile"
          value={loginData.identifier}
          onChange={(e) =>
            setLoginData({ ...loginData, identifier: e.target.value })
          }
        />
      </div>

      {loginMethod === "password" && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="Enter password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
        </div>
      )}

      <div>  
        <div className={styles.switchLoginMethod}>
        {loginMethod === "password" && (
          <button
            type="button"
            className={styles.switchButton}
            onClick={() => onMethodChange("otp")}
          >
            Login with OTP
          </button>
        )}

        {loginMethod === "otp" && (
          <button
            type="button"
            className={styles.switchButton}
            onClick={() => onMethodChange("password")}
          >
            Login with Password
          </button>
        )}
        </div>
         <div className={styles.forgotPassword}>         
        <span className={styles.forgotLink} onClick={onForgotPassword}>
          Forgot Password?
        </span>
  
        </div>
     </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading
          ? "Please wait..."
          : loginMethod === "password"
            ? "Sign In"
            : "Send OTP"}
      </button>

      
    </form>
  );
}
