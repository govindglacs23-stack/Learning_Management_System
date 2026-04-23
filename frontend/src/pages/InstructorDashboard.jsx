// Instructor Dashboard
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { FiPlus, FiX } from 'react-icons/fi';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [videoData, setVideoData] = useState({ title: '', description: '', videoUrl: '', duration: 0 });
  const [resourceData, setResourceData] = useState({ title: '', type: 'video', url: '', description: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'Beginner',
    price: 0,
    thumbnail: 'https://via.placeholder.com/300x200',
    duration: 0,
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Programming',
      level: 'Beginner',
      price: 0,
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 0,
    });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await courseAPI.createCourse(formData);
      setCourses([...courses, response.data.course]);
      setShowModal(false);
      resetForm();
      alert('Course created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const response = await courseAPI.updateCourse(editingId, formData);
      setCourses(courses.map((c) => (c._id === editingId ? response.data.course : c)));
      setShowModal(false);
      resetForm();
      alert('Course updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingId(course._id);
    setIsEditMode(true);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      category: course.category || 'Programming',
      level: course.level || 'Beginner',
      price: course.price || 0,
      thumbnail: course.thumbnail || 'https://via.placeholder.com/300x200',
      duration: course.duration || 0,
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.deleteCourse(courseId);
        setCourses(courses.filter(c => c._id !== courseId));
        alert('Course deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      const response = await courseAPI.publishCourse(courseId);
      setCourses(courses.map(c => c._id === courseId ? response.data.course : c));
      alert('Course published successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to publish course');
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const response = await courseAPI.addVideo(editingId, videoData);
      setCourses(courses.map(c => c._id === editingId ? response.data.course : c));
      setVideoData({ title: '', description: '', videoUrl: '', duration: 0 });
      alert('Video added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add video');
    }
  };

  const handleDeleteVideo = async (courseId, videoId) => {
    try {
      await courseAPI.deleteVideo(courseId, videoId);
      setCourses(courses.map(c => {
        if (c._id === courseId) {
          return { ...c, videos: c.videos.filter(v => v._id !== videoId) };
        }
        return c;
      }));
      alert('Video deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete video');
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const response = await courseAPI.addResource(editingId, resourceData);
      setCourses(courses.map(c => c._id === editingId ? response.data.course : c));
      setResourceData({ title: '', type: 'video', url: '', description: '' });
      alert('Resource added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add resource');
    }
  };

  const handleDeleteResource = async (courseId, resourceId) => {
    try {
      await courseAPI.deleteResource(courseId, resourceId);
      setCourses(courses.map(c => {
        if (c._id === courseId) {
          return { ...c, resources: c.resources?.filter(r => r._id !== resourceId) || [] };
        }
        return c;
      }));
      alert('Resource deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">Welcome, {user.name}! 👨‍🏫</h1>
            <p className="text-purple-200">Manage your courses and monitor student progress</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold"
          >
            <FiPlus /> Create Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">📊 Total Courses</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">{courses.length}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">👥 Total Students</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text">
              {courses.reduce((sum, c) => sum + c.totalStudents, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-6 hover:border-purple-500/60 transition">
            <h3 className="text-purple-300 text-sm font-semibold mb-2">✅ Published</h3>
            <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
              {courses.filter(c => c.isPublished).length}
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-6">My Courses</h2>

          {loading ? (
            <p className="text-center text-purple-200">Loading...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-200 mb-4">You haven't created any courses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const statusClass = course.isPublished
                  ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 border-green-500/50 text-green-200'
                  : 'bg-gradient-to-r from-gray-500/30 to-slate-500/30 border-gray-500/50 text-gray-200';
                return (
                  <div
                    key={course._id}
                    className="border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition bg-gradient-to-b from-slate-700/30 to-slate-900/30 backdrop-blur"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text mb-2">
                        {course.title}
                      </h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusClass}`}>
                          {course.isPublished ? '🟢 Published' : '⚫ Draft'}
                        </span>
                        <span className="text-sm text-cyan-300">
                          👥 {course.totalStudents}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <button
                          onClick={() => navigate(`/instructor/course/${course._id}/edit`)}
                          className="flex-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-purple-400/50 text-purple-200 py-2 rounded hover:from-blue-600/50 hover:to-purple-600/50 transition"
                        >
                          Edit
                        </button>
                        {!course.isPublished && (
                          <button
                            onClick={() => handlePublishCourse(course._id)}
                            className="flex-1 bg-gradient-to-r from-green-600/30 to-cyan-600/30 border border-green-400/50 text-green-200 py-2 rounded hover:from-green-600/50 hover:to-cyan-600/50 transition"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="flex-1 bg-gradient-to-r from-red-600/30 to-pink-600/30 border border-red-400/50 text-red-200 py-2 rounded hover:from-red-600/50 hover:to-pink-600/50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-900/50 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                {isEditMode ? '✏️ Edit Course' : '✨ Create New Course'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-purple-400 hover:text-pink-400 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={isEditMode ? handleUpdateCourse : handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition placeholder-purple-300/50"
                  placeholder="e.g., React Basics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition placeholder-purple-300/50"
                  placeholder="Course description..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition"
                >
                  <option className="bg-slate-800" value="Programming">Programming</option>
                  <option className="bg-slate-800" value="Design">Design</option>
                  <option className="bg-slate-800" value="Business">Business</option>
                  <option className="bg-slate-800" value="Development">Development</option>
                  <option className="bg-slate-800" value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition"
                >
                  <option className="bg-slate-800" value="Beginner">Beginner</option>
                  <option className="bg-slate-800" value="Intermediate">Intermediate</option>
                  <option className="bg-slate-800" value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition placeholder-purple-300/50"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-500/60 transition placeholder-purple-300/50"
                  placeholder="0"
                />
              </div>

              {isEditMode && (
                <>
                  <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg mt-4 backdrop-blur">
                    <h3 className="text-lg font-semibold text-purple-200 mb-3">🎥 Videos</h3>
                    <div className="space-y-3 mb-4">
                      {courses.find(c => c._id === editingId)?.videos?.length ? (
                        courses.find(c => c._id === editingId).videos.map(video => (
                          <div key={video._id} className="flex justify-between gap-2 items-center rounded border border-purple-500/30 p-2 bg-slate-700/30">
                            <div>
                              <p className="text-sm font-semibold text-purple-200">{video.title}</p>
                              <p className="text-xs text-purple-400">{video.duration} min</p>
                            </div>
                            <button onClick={() => handleDeleteVideo(editingId, video._id)} className="text-red-400 text-xs hover:text-red-300">Delete</button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-purple-300">No videos yet.</p>
                      )}
                    </div>

                    <form onSubmit={handleAddVideo} className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Video title"
                        value={videoData.title}
                        onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                      />
                      <input
                        type="text"
                        required
                        placeholder="YouTube URL or video URL"
                        value={videoData.videoUrl}
                        onChange={(e) => setVideoData({ ...videoData, videoUrl: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                      />
                      <textarea
                        placeholder="Description"
                        value={videoData.description}
                        onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                        rows={2}
                      />
                      <input
                        type="number"
                        required
                        placeholder="Duration (minutes)"
                        value={videoData.duration}
                        onChange={(e) => setVideoData({ ...videoData, duration: parseInt(e.target.value) })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                      />
                      <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded font-semibold hover:shadow-lg transition">Add Video</button>
                    </form>
                  </div>

                  <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg mt-4 backdrop-blur">
                    <h3 className="text-lg font-semibold text-purple-200 mb-3">📄 Resources</h3>
                    <div className="space-y-3 mb-4">
                      {courses.find(c => c._id === editingId)?.resources?.length ? (
                        courses.find(c => c._id === editingId).resources.map(resource => (
                          <div key={resource._id} className="flex justify-between gap-2 items-center rounded border border-purple-500/30 p-2 bg-slate-700/30">
                            <div>
                              <p className="text-sm font-semibold text-purple-200">{resource.title} ({resource.type})</p>
                              <a href={resource.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:text-pink-400">Open</a>
                            </div>
                            <button onClick={() => handleDeleteResource(editingId, resource._id)} className="text-red-400 text-xs hover:text-red-300">Delete</button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-purple-300">No resources yet.</p>
                      )}
                    </div>

                    <form onSubmit={handleAddResource} className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Resource title"
                        value={resourceData.title}
                        onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                      />
                      <select
                        value={resourceData.type}
                        onChange={(e) => setResourceData({ ...resourceData, type: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option className="bg-slate-800" value="video">Video</option>
                        <option className="bg-slate-800" value="pdf">PDF</option>
                        <option className="bg-slate-800" value="doc">DOC</option>
                        <option className="bg-slate-800" value="other">Other</option>
                      </select>
                      <input
                        type="url"
                        required
                        placeholder="Resource URL"
                        value={resourceData.url}
                        onChange={(e) => setResourceData({ ...resourceData, url: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                      />
                      <textarea
                        placeholder="Description"
                        value={resourceData.description}
                        onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded px-2 py-1 text-white outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300/50"
                        rows={2}
                      />
                      <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded font-semibold hover:shadow-lg transition">Add Resource</button>
                    </form>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  {isEditMode ? '✏️ Update Course' : '✨ Create Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700/50 border border-purple-500/30 text-purple-200 py-2 rounded-lg font-semibold hover:bg-slate-600/50 hover:border-purple-500/60 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
