import React, { useState } from 'react';
import '../../styles/style.css';
import axios from 'axios';
import API_URL from '../../config.js';

const LoginPage = ({ setUser, setCurrentPage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert('Please fill all fields');
    }

    if (!isLogin && !username) {
      return alert('Please provide a username');
    }

    // enforce minimum password length of 8 for registration
    if (!isLogin && password.length < 8) {
      return alert('Password must be at least 8 characters long');
    }

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
        const token = response.data?.token;
        localStorage.setItem('accessToken', token);
      } else {
        response = await axios.post(`${API_URL}/auth/register`, { username, email, password }, { withCredentials: true });
        const token = response.data?.token;
        localStorage.clear('accessToken');
        localStorage.setItem('accessToken', token);
      }
      
      if (response.data.data) {
        if (isLogin) {
          setUser(response.data.data);
          setCurrentPage('dashboard');
        } else {
          // registration successful — switch to login view instead of auto-login
          alert('Registration successful. Please login to continue.');
          setIsLogin(true);
          resetFields();
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="lt-bg">
      <div className="lt-wrapper">
        <div className="lt-card">
          <h1 className="lt-title">{isLogin ? 'Login' : 'Register'}</h1>

          <form className="lt-form" onSubmit={handleSubmit}>

            {/* Username - only for register */}
            {!isLogin && (
              <div className="lt-field">
                <label className="lt-label">Username</label>
                <input
                  type="text"
                  className="lt-input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="lt-underline" />
              </div>
            )}

            {/* Email */}
            <div className="lt-field">
              <label className="lt-label">Email</label>
              <input
                type="email"
                className="lt-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="lt-underline" />
            </div>

            {/* Password */}
            <div className="lt-field">
              <label className="lt-label">Password</label>
              <input
                type="password"
                className="lt-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="lt-underline" />
            </div>

            
            {/* Submit button */}
            <div className="lt-cta">
              <button type="submit" className="lt-button">
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </div>

            {/* Switch Login / Signup */}
            <div className="lt-footer">
              {isLogin ? (
                <>
                  <span>Not a Member? </span>
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(false);
                      resetFields();
                    }}
                  >
                    Register
                  </a>
                </>
              ) : (
                <>
                  <span>Already have an account? </span>
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(true);
                      resetFields();
                    }}
                  >
                    Login
                  </a>
                </>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const user = await registerService(username, email, password);
        return res.status(201).json({
            message: "User registered successfully",
            data: user,
        });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred" });
    }
};