import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../logo.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [userType, setUserType] = useState("Student");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError({ email: !email, password: !password });

    if (password === 'pas') {
      let user_data = {
        "user": {
            "active_status": null,
            "address": "",
            "country": null,
            "created_by": null,
            "created_on": "2024-11-18 13: 57: 16.440362",
            "email": null,
            "first_name": "Test B",
            "id": "45724ffc-cca4-48a3-bd94-9a7436692448",
            "last_name": "RenDarl",
            "other_info": null,
            "other_name": "",
            "phone": null,
            "updated_by": null,
            "updated_on": "2024-11-18 13:57:16.440434",
            "file_photo": null
        },
        "access_key": {
            "exp": 1738023508,
            "id": "45724ffc-cca4-48a3-bd94-9a7436692448"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzgwMjM1MDgsImlkIjoiNDU3MjRmZmMtY2NhNC00OGEzLWJkOTQtOWE3NDM2NjkyNDQ4In0.Ch8yaHNrheWU0sXN59m2zzsiUNSfJiqYb4c5J2UxIGc",
        "counter": 600000
    }
      localStorage.setItem("userDataStore", JSON.stringify(user_data));

      // let userDataStore = JSON.parse(localStorage.getItem("userDataStore"));
      
      setTimeout(() => window.location.href = '/home', 1000);
    }
    else{
      setLoginError("Incorrect email or password.");
    }

    // if (!email || !password) return;

    // setLoading(true);
    // setLoginError("");

    
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg">
      <img src={logo} alt="Logo" className="w-24 mx-auto mb-6" />
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError((prev) => ({ ...prev, email: false }));
            }}
            className={`w-full p-2 mt-1 border rounded ${error.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {error.email && <p className="text-red-500 text-sm">Email is required.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError((prev) => ({ ...prev, password: false }));
            }}
            className={`w-full p-2 mt-1 border rounded ${error.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          {error.password && <p className="text-red-500 text-sm">Password is required.</p>}
        </div>

        <button
          type="submit"
          className={!loading ? 'w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded' : "bg-gray-600 "}
          disabled={loading}
        >
          {loading ? <span className="loader"></span> : 'Login'}
        </button>

        {loginError && <p className="text-red-500 text-center mt-2">{loginError}</p>}
      </form>

      <div className="mt-6 text-center">
        <Link to="/signup" className="text-blue-500 hover:underline">Don't have an account? Sign Up</Link>
        <br />
        <Link to="/reset-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default Login;
