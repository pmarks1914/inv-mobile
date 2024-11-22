import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
      let data = JSON.stringify(formData);
      let config = {
        method: 'post',
        url: process.env.REACT_APP_BASE_API + "/v1/registration",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      // console.log("formData ", formData)
      sendOTP()  
  };

  function sendOTP(){

    const payload = JSON.stringify({
      "email": formData?.email
    })


    let config_otp = {
      method: 'post',
      url: process.env.REACT_APP_BASE_API + "/v1/otp/email",
      headers: {
          'Content-Type': 'application/json'
      },
      data: payload
  };
    axios(config_otp).then(function (response){
      // console.log(response)
      
    })
    .catch(function (error) {
      // console.log(error);
    });

    Swal.fire({
      text: 'Check your email and type the code here.',
      input: 'text',
      inputAttributes: {
          autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      confirmButtonColor: '#1677ff',
      cancelButtonColor: '#d33',
      preConfirm: (otpCode) => {
          // otpCodecription = otpCode
          if (otpCode === "") {
              Swal.showValidationMessage(
                  `Request failed! code is required.`
              )
          }
          else {
              let data = JSON.stringify({
                  "email": formData?.email,
                  "first_name": formData?.first_name,
                  "last_name": formData?.last_name,
                  "other_name": formData?.other_names,
                  "password": formData?.password,
                  "password1": formData?.password,
                  "role": "STUDENT",
                  "description": "",
                  "address": "",
                  "otp": otpCode
              })
              let config = {
                  method: 'post',
                  url: process.env.REACT_APP_BASE_API + "/v1/registration",
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  data: data
              };

              sendApiData(config);
          }
      },
  }).then((result1) => {

  })

  }

  function sendApiData(config){
    // console.log(config)
    axios(config).then(function (response){
      
      if(response?.data?.code === 200){
        Swal.fire({
          // title: 'Successfully created!',
          text: response?.data?.message,
          icon: "success",
          allowOutsideClick: false,
          // allowEscapeKey: false,
          showCancelButton: false,
          confirmButtonColor: '#950707',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => { 
          navigate("/")
        });
      }
      else{
        Swal.fire({
          // title: 'Successfully created!',
          text: response?.data?.message,
          icon: "error",
          allowOutsideClick: false,
          // allowEscapeKey: false,
          showCancelButton: false,
          confirmButtonColor: '#950707',
          // cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => { });
      }
      
    })
    .catch(function (error) {
      Swal.fire({
        // title: 'Successfully created!',
        text: error?.response?.data?.message,
        icon: "error",
        allowOutsideClick: false,
        // allowEscapeKey: false,
        showCancelButton: false,
        confirmButtonColor: '#950707',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => { });    
    });
  }
  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Sign Up</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full p-2 mt-1 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full p-2 mt-1 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-2 mt-1 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full p-2 mt-1 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full p-2 mt-1 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-500 hover:underline">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default SignUp;
