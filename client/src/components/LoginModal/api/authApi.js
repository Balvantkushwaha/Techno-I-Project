import axios from 'axios';

const baseURL = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:3000/api/v1/auth';

const authClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Request failed'
  );
};

export const authApi = {
  initRegister: async (identifier) => {
    const res = await authClient.post('/register/init', { identifier });
    return res.data;
  },

  verifyRegisterOtp: async (identifier, otp) => {
    const res = await authClient.post('/register/verify-otp', { identifier, otp });
    return res.data;
  },

  completeRegister: async ({ identifier, firstName, lastName, password, confirmPassword }) => {
    const res = await authClient.post('/register/complete', {
      identifier,
      firstName,
      lastName,
      password,
      confirmPassword
    });
    return res.data;
  },

  loginWithPassword: async (identifier, password) => {
    const res = await authClient.post('/login/method', {
      identifier,
      password,
      loginMethod: 'password'
    });
    return res.data;
  },

  requestLoginOtp: async (identifier) => {
    const res = await authClient.post('/login/method', {
      identifier,
      loginMethod: 'otp'
    });
    return res.data;
  },

  verifyLoginOtp: async (identifier, otp) => {
    const res = await authClient.post('/login/verify-otp', { identifier, otp });
    return res.data;
  },

  forgetPassword: async (identifier) => {
    const res = await authClient.post('/forget-password', { identifier });
    return res.data;
  },

  resetPassword: async ({ identifier, otp, newPassword, confirmPassword }) => {
    const res = await authClient.put('/reset-password', {
      identifier,
      otp,
      newPassword,
      confirmPassword
    });
    return res.data;
  },

  getProfile: async () => {
    const res = await authClient.get('/profile');
    return res.data;
  }
};

export { getErrorMessage };
