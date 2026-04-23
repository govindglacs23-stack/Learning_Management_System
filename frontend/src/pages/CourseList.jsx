// Course list page
import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [search, category, level]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses({ search, category, level });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">Explore Courses</h1>
        <p className="text-purple-200 mb-8">Discover amazing courses to enhance your skills</p>

        {/* Filters */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-purple-500/30 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">Search</label>
              <div className="flex items-center bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 hover:border-purple-500/60 transition">
                <FiSearch className="text-purple-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent outline-none text-white placeholder-purple-300/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 outline-none text-white hover:border-purple-500/60 transition"
              >
                <option className="bg-slate-800" value="">All Categories</option>
                <option className="bg-slate-800" value="Programming">Programming</option>
                <option className="bg-slate-800" value="Design">Design</option>
                <option className="bg-slate-800" value="Business">Business</option>
                <option className="bg-slate-800" value="Development">Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 outline-none text-white hover:border-purple-500/60 transition"
              >
                <option className="bg-slate-800" value="">All Levels</option>
                <option className="bg-slate-800" value="Beginner">Beginner</option>
                <option className="bg-slate-800" value="Intermediate">Intermediate</option>
                <option className="bg-slate-800" value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  setLevel('');
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition font-semibold"
              >
                🔄 Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-xl text-purple-200">Loading amazing courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-purple-200">No courses found. Try adjusting your filters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course._id} to={`/course/${course._id}`}>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-purple-500/30 overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition transform hover:scale-105">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text mb-2">
                      {course.title}
                    </h3>
                    <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-purple-500/50 text-cyan-300 px-3 py-1 rounded-full font-semibold">
                        {course.level}
                      </span>
                      <span className="text-sm font-semibold text-pink-300">
                        👥 {course.totalStudents || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2 mb-4">
                      <div className="text-sm text-purple-300">
                        {course.price && course.price > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs line-through text-purple-400">${course.price.toFixed(2)}</span>
                            <span className="text-lg font-bold text-cyan-400">
                              ${(course.price - (course.price * (course.discount || 0)) / 100).toFixed(2)}
                            </span>
                            {course.discount > 0 && (
                              <span className="text-xs bg-red-500/30 text-red-200 px-2 py-1 rounded">-{course.discount}%</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-cyan-400 font-semibold">🎉 FREE</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-purple-500/20">
                      <p className="text-sm text-purple-300">
                        👨‍🏫 {course.instructorName || 'Instructor'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
