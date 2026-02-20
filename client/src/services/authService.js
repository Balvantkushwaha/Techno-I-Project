import { apiClient } from '../api/axios';

class AuthService {
  // Register: Step 1 - Send OTP
  async sendRegisterOTP(identifier) {
    try {
      const response = await apiClient.post('/auth/register/init', { identifier });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Register: Step 2 - Verify OTP
  async verifyRegisterOTP(identifier, otp) {
    try {
      const response = await apiClient.post('/auth/register/verify-otp', { identifier, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Register: Step 3 - Complete Registration
  async completeRegistration(userData) {
    try {
      const response = await apiClient.post('/auth/register/complete', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Login with Password or OTP Request
  async login(credentials) {
    alert("Login API called with credentials: " + JSON.stringify(credentials));
    try {
      const response = await apiClient.post('/auth/login/method', credentials);
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Verify Login OTP
  async verifyLoginOTP(identifier, otp) {
    try {
      const response = await apiClient.post('/auth/login/verify-otp', { identifier, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Forgot Password - Send OTP
  async forgotPassword(identifier) {
    try {
      const response = await apiClient.post('/auth/forget-password', { identifier });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Reset Password
  async resetPassword(data) {
    try {
      const response = await apiClient.put('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get User Profile
  async getProfile() {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Logout
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new AuthService();