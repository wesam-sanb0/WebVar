import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../Input';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state for API failures
  const navigate = useNavigate();
  const {setToken} = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }
  
      const data = await response.json();
      console.log(data);
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      setToken(data.token)
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
          Login
        </h2>
        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <Input
            placeholder="Email Address"
            type="email"
            name="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            name="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center mb-6">
            <Link to="/forgetpassword" className="text-sm text-cyan-400 hover:underline">
              Forget Password?
            </Link>
          </div>
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin w-6 h-6 mx-auto" /> : 'Login'}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}