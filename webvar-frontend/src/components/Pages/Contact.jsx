import { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    try {
      const response = await fetch('http://localhost:3000/api/auth/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      setStatus({ loading: false, error: null, success: 'Message sent successfully! We’ll get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ loading: false, error: 'Failed to send message. Please try again later.', success: null });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-8 mx-auto my-10"
    >
      <h2 className="text-3xl font-bold text-white mb-2">Contact Us</h2>
      <p className="text-white mb-6">
        Have questions? Fill out the form below and we’ll get back to you.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-white mb-2">
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 bg-white text-gray-800 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
            required
          />
        </div>
        {status.error && (
          <p className="text-red-400 mb-4 text-center">{status.error}</p>
        )}
        {status.success && (
          <p className="text-green-400 mb-4 text-center">{status.success}</p>
        )}
        <motion.button
          className={`w-full py-3 px-4 bg-cyan-500 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 ${
            status.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-600'
          }`}
          whileHover={!status.loading ? { scale: 1.02 } : {}}
          whileTap={!status.loading ? { scale: 0.98 } : {}}
          type="submit"
          disabled={status.loading}
        >
          {status.loading ? 'Sending...' : 'Send Message'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Contact;