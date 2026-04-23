// Register page component
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl shadow-purple-900/50 border border-purple-500/30 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">LMS</h1>
          <h2 className="text-xl font-semibold text-purple-200">Create Your Account</h2>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3 backdrop-blur">
            <FiAlertCircle className="text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-purple-200 mb-2">Full Name</label>
            <div className="flex items-center bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 hover:border-purple-500/60 transition">
              <FiUser className="text-purple-400 mr-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-transparent outline-none text-white placeholder-purple-300/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-200 mb-2">Email Address</label>
            <div className="flex items-center bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 hover:border-purple-500/60 transition">
              <FiMail className="text-purple-400 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-transparent outline-none text-white placeholder-purple-300/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-purple-200 mb-2">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition"
            >
              <option className="bg-slate-800" value="student">👨‍🎓 Student</option>
              <option className="bg-slate-800" value="instructor">👨‍🏫 Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105 border border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : '🎉 Register'}
          </button>
        </form>

        <p className="text-center text-purple-300 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:text-pink-400 transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
