// Admin Dashboard
export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-light dark:bg-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-dark dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Welcome, {user.name}!</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-primary">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Courses</h3>
            <p className="text-4xl font-bold text-secondary">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Enrollments</h3>
            <p className="text-4xl font-bold text-green-500">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-purple-500">$0</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Admin features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
