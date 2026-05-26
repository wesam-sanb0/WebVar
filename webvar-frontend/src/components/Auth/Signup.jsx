import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import { Lock, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name.trim(), 
          email:email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }
      
      const result = await response.json();
      console.log(result);
      setStatus({ loading: false, error: null, success: 'Registration successful! Redirecting to login...' });
      setTimeout(() => {
        navigate('/login');
      }, 1500); 
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
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
          Create account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            placeholder="Full name"
            type="text"
            name="fullname"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
          <PasswordStrengthMeter password={password} />

          {status.error && (
            <p className="text-red-400 mb-4 text-center">{status.error}</p>
          )}
          {status.success && (
            <p className="text-green-400 mb-4 text-center">{status.success}</p>
          )}

          <motion.button
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ${
              status.loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-blue-700'
            }`}
            whileHover={!status.loading ? { scale: 1.02 } : {}}
            whileTap={!status.loading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={status.loading}
          >
            {status.loading ? 'Signing Up...' : 'SIGN UP'}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}