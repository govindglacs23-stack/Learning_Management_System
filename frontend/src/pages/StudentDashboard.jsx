// Student Dashboard
import { useState, useEffect } from 'react';
import { enrollmentAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await enrollmentAPI.getStudentEnrollments();
      setEnrollments(response.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setError(error.message || 'Failed to load enrollments');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">Welcome, {user.name || 'Student'}! 🎓</h1>
          <p className="text-purple-200">Track your learning progress and continue your courses</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg mb-8 backdrop-blur">
            <p className="font-semibold mb-3">{error}</p>
            <button
              onClick={fetchEnrollments}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold transition"
            >
              🔄 Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">📚 Courses Enrolled</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">{enrollments.length}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">⏳ In Progress</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
              {enrollments.filter(e => e.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">✅ Completed</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
              {enrollments.filter(e => e.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">🏆 Certificates</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text">
              {enrollments.filter(e => e.certificateIssued).length}
            </p>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-6">My Courses</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-purple-200">Loading your courses...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-200 mb-4">You haven't enrolled in any courses yet</p>
              <Link to="/courses" className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 font-semibold transition">
                🚀 Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const statusColor = enrollment.status === 'completed'
                  ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 border-green-500/50 text-green-200'
                  : enrollment.status === 'in-progress'
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-500/50 text-blue-200'
                    : 'bg-gradient-to-r from-gray-500/30 to-slate-500/30 border-gray-500/50 text-gray-200';
                return (
                  <div
                    key={enrollment._id}
                    className="border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition hover:shadow-lg hover:shadow-purple-500/20 bg-slate-700/30 backdrop-blur"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-purple-200 text-sm mt-1">
                          {enrollment.course.description.substring(0, 100)}...
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-purple-300">Progress</span>
                        <span className="text-sm font-semibold text-cyan-300">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-purple-300">
                        🎥 Videos watched: <span className="text-cyan-300 font-semibold">{enrollment.completedVideos.length}</span>
                      </div>
                      <Link
                        to={`/course/${enrollment.course._id}`}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 text-sm font-semibold transition transform hover:scale-105"
                      >
                        Continue Learning →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
