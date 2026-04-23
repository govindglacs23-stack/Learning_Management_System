// Navigation bar component
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar({ isDarkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">LMS</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-primary">
              Courses
            </Link>

            {user.token || localStorage.getItem('token') ? (
              <>
                {user.role === 'student' && (
                  <Link
                    to="/student-dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'instructor' && (
                  <Link
                    to="/instructor-dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Teach
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                >
                  {isDarkMode ? (
                    <FiSun className="text-yellow-500" />
                  ) : (
                    <FiMoon className="text-gray-700" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                >
                  {isDarkMode ? (
                    <FiSun className="text-yellow-500" />
                  ) : (
                    <FiMoon className="text-gray-700" />
                  )}
                </button>

                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/courses"
              className="block text-gray-700 dark:text-gray-300 hover:text-primary py-2"
            >
              Courses
            </Link>

            {user.token || localStorage.getItem('token') ? (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-center bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-secondary text-white px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
