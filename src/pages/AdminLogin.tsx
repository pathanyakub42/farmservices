import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login(password)) {
      const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirectTo);
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-20 bg-gradient-to-br from-gray-900 via-purple-900/50 to-red-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/20 backdrop-blur-3xl rounded-3xl p-12 shadow-3xl border border-white/30 max-w-md w-full mx-4"
      >
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-gray-200 to-gray-100 bg-clip-text">
            Admin Panel
          </h1>
          <p className="text-gray-300">Enter password to access dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">Password</label>
            <div className="relative">
              <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg font-medium placeholder-gray-400"
                placeholder="••••••••"
                autoComplete="off"
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg flex items-center justify-center space-x-3"
          >
            <LogIn className="h-6 w-6" />
            <span>Login</span>
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Demo: Password - <span className="font-mono bg-white/20 px-2 py-1 rounded-lg">admin</span>
        </p>
      </motion.div>
    </div>
  );
}