// Login page component
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email: email.toLowerCase(), password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl shadow-purple-900/50 border border-purple-500/30 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">LMS</h1>
          <h2 className="text-xl font-semibold text-purple-200">Sign In to Continue Learning</h2>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3 backdrop-blur">
            <FiAlertCircle className="text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-purple-200 mb-2">Email Address</label>
            <div className="flex items-center bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 hover:border-purple-500/60 transition">
              <FiMail className="text-purple-400 mr-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-transparent outline-none text-white placeholder-purple-300/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-200 mb-2">Password</label>
            <div className="flex items-center bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 hover:border-purple-500/60 transition">
              <FiLock className="text-purple-400 mr-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent outline-none text-white placeholder-purple-300/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105 border border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <p className="text-center text-purple-300 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:text-pink-400 transition">
            Register here
          </Link>
        </p>

        <div className="mt-6 p-4 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-lg text-sm">
          <p className="font-semibold text-purple-300 mb-3">📝 Demo Credentials:</p>
          <p className="text-purple-200"><span className="text-cyan-300">Student:</span> student@example.com / password</p>
          <p className="text-purple-200"><span className="text-cyan-300">Instructor:</span> instructor@example.com / password</p>
          <p className="text-purple-200"><span className="text-cyan-300">Admin:</span> admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
}
