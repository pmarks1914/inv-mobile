import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', password1: '' });
  const [formDataError, setFormDataError] = useState({ email: false, password: false, password1: false });

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasUppercase = /[A-Z]/.test(formData.password || "");
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|~`-]/.test(formData.password || "");
    const isPasswordValid = formData.password?.length >= 8 && hasUppercase && hasSpecialChar;

    setFormDataError({
      email: !formData.email,
      password: !isPasswordValid,
      password1: formData.password !== formData.password1,
    });

    if (formData.email && isPasswordValid && formData.password === formData.password1) {
      sendOTP();
    }
  };

  const sendOTP = () => {
    axios.post(`${process.env.REACT_APP_BASE_API}/v1/send/otp/email`, {
      email: formData.email,
    }).then(() => {
      Swal.fire({
        text: 'Check your email and enter the code here.',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        preConfirm: (otpCode) => {
          if (!otpCode) {
            Swal.showValidationMessage('Code is required.');
          } else {
            resetPassword(otpCode);
          }
        },
      });
    }).catch((error) => {
      console.error("Error sending OTP:", error);
    });
  };

  const resetPassword = (otpCode) => {
    axios.put(`${process.env.REACT_APP_BASE_API}/v1/forget/password`, {
      email: formData.email,
      password: formData.password,
      code: otpCode,
    }).then((response) => {
      Swal.fire({
        text: response.data.message,
        icon: 'success',
      }).then(() => window.location.href = '/login');
    }).catch((error) => {
      Swal.fire({
        text: error.response?.data?.message || "Error resetting password.",
        icon: 'error',
      });
    });
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setFormDataError({ ...formDataError, email: false });
            }}
            className={`w-full p-2 mt-1 border rounded ${formDataError.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {formDataError.email && <p className="text-red-500 text-sm">Email is required.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setFormDataError({ ...formDataError, password: false });
            }}
            className={`w-full p-2 mt-1 border rounded ${formDataError.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter a new password"
          />
          {formDataError.password && (
            <p className="text-red-500 text-sm">
              Password must be at least 8 characters, with uppercase and special characters.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={formData.password1}
            onChange={(e) => {
              setFormData({ ...formData, password1: e.target.value });
              setFormDataError({ ...formDataError, password1: false });
            }}
            className={`w-full p-2 mt-1 border rounded ${formDataError.password1 ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Confirm your password"
          />
          {formDataError.password1 && <p className="text-red-500 text-sm">Passwords do not match.</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Submit
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-500 hover:underline">Already have an account? Login</Link>
      </div>

    </div>
  );
};

export default ResetPassword;
