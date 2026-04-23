// Course Details page - Amazing Modern Design
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import { FiPlay, FiBook, FiUsers, FiDownload, FiChevronDown, FiChevronUp, FiMenu, FiX, FiStar } from 'react-icons/fi';
import PaymentCheckout from '../components/PaymentCheckout';

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({ videos: true, resources: true });
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!id) {
                throw new Error('Invalid course ID');
            }

            console.log('Fetching course with ID:', id);
            const response = await courseAPI.getCourse(id);
            console.log('Course data received:', response.data);

            if (!response.data.course) {
                throw new Error('Course not found in response');
            }

            setCourse(response.data.course);
            if (response.data.course?.videos?.length > 0) {
                setSelectedVideo(response.data.course.videos[0]);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch course';
            setError(errorMsg);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        // Check if course requires payment
        if (course?.isPaymentRequired || course?.paymentType === 'paid' || course?.paymentType === 'premium') {
            // Show payment modal for paid courses
            setShowPaymentModal(true);
        } else {
            // Free course - enroll directly
            try {
                await enrollmentAPI.enrollCourse({ courseId: id });
                setEnrolled(true);
                alert('✅ Successfully enrolled in the course!');
            } catch (error) {
                alert(error.response?.data?.message || '❌ Enrollment failed');
            }
        }
    };

    const handlePaymentSuccess = () => {
        setEnrolled(true);
        setShowPaymentModal(false);
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const match = url.match(youtubeRegex);
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}?controls=1&modestbranding=1`;
        }
        return null;
    };

    const isVideoFile = (url) => {
        if (!url) return false;
        return /\.(mp4|webm|ogg|mov)$/i.test(url);
    };

    const isPdf = (url) => {
        if (!url) return false;
        return url.toLowerCase().endsWith('.pdf');
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-cyan-400 mx-auto mb-4"></div>
                    <p className="text-xl text-purple-200">Loading amazing content...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-xl text-purple-200">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-400 mb-4">Error: {error}</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-purple-200 mb-4">Course not found</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const videoUrl = selectedVideo?.videoUrl;
    const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl);
    const isVideoFileFormat = isVideoFile(videoUrl);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Video Player Section with Amazing Styling */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-purple-500/20 shadow-2xl">
                <div className="max-w-7xl mx-auto p-6">
                    {selectedVideo && videoUrl ? (
                        <div className="space-y-6">
                            {/* Large Video Player - Amazing Aspect Ratio */}
                            {youtubeEmbedUrl ? (
                                <div className="relative w-full rounded-xl overflow-hidden shadow-2xl shadow-purple-900/50 border border-purple-500/30 bg-black">
                                    <div style={{ paddingBottom: '62.5%' }} className="relative">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={youtubeEmbedUrl}
                                            title={selectedVideo.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            ) : isVideoFileFormat ? (
                                <video
                                    controls
                                    className="w-full rounded-xl"
                                    style={{ maxHeight: '600px' }}
                                >
                                    <source src={videoUrl} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-full h-96 flex items-center justify-center rounded-xl border border-purple-500/20">
                                    <p className="text-purple-300">No video available</p>
                                </div>
                            )}

                            {/* Video Info Below Player */}
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-lg border border-purple-500/20">
                                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{selectedVideo?.title || 'Video'}</h2>
                                <p className="text-purple-200 text-sm mb-4">{selectedVideo?.description || ''}</p>
                                <p className="text-purple-300 text-xs">Duration: {selectedVideo?.duration || 'N/A'} minutes</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center rounded-xl border border-purple-500/20">
                            <div className="text-center">
                                <FiPlay className="text-purple-400 mx-auto mb-4" size={48} />
                                <p className="text-purple-300">Select a video to play</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area - Two Column Layout */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                    {/* Left Column - Course Info & Materials */}
                    <div className="flex-1">
                        {/* Course Header Info */}
                        <div className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-purple-500/30 backdrop-blur shadow-xl">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6">{course?.title || 'Course'}</h1>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition">
                                    <p className="text-purple-300 text-xs font-semibold">INSTRUCTOR</p>
                                    <p className="text-white font-bold mt-1">{course?.instructor?.name || course?.instructorName || 'Instructor'}</p>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition">
                                    <p className="text-purple-300 text-xs font-semibold">LEVEL</p>
                                    <p className="text-white font-bold mt-1">{course?.level || 'Beginner'}</p>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition">
                                    <p className="text-purple-300 text-xs font-semibold">DURATION</p>
                                    <p className="text-white font-bold mt-1">{course?.duration || 0}h</p>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition">
                                    <p className="text-purple-300 text-xs font-semibold">STUDENTS</p>
                                    <p className="text-white font-bold mt-1">{course?.totalStudents || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Enroll Button - Amazing Gradient */}
                        {!enrolled && (
                            <div className="mb-8">
                                <button
                                    onClick={handleEnroll}
                                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105 border border-purple-400/50"
                                >
                                    {course?.isPaymentRequired || course?.paymentType === 'paid' || course?.paymentType === 'premium'
                                        ? `💳 Buy Now - $${(course?.price - (course?.price * (course?.discount || 0)) / 100).toFixed(2)}`
                                        : '🚀 Enroll Now - Start Learning'
                                    }
                                </button>
                                {(course?.isPaymentRequired || course?.paymentType === 'paid' || course?.paymentType === 'premium') && course?.discount > 0 && (
                                    <p className="text-center text-cyan-300 text-sm mt-2">
                                        💰 {course?.discount}% OFF! Was ${course?.price?.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        )}

                        {enrolled && (
                            <div className="mb-8 bg-gradient-to-r from-green-900/50 to-cyan-900/50 text-cyan-200 p-4 rounded-lg text-center font-bold border border-green-500/50">
                                ✨ You are enrolled in this course
                            </div>
                        )}

                        {/* About Section */}
                        <div className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-purple-500/30">
                            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-4">About This Course</h3>
                            <p className="text-purple-200 leading-relaxed text-lg">{course?.description || 'No description available'}</p>
                        </div>

                        {/* Course Materials */}
                        {(course?.resources || []).length > 0 && (
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-purple-500/30">
                                <button
                                    onClick={() => toggleSection('resources')}
                                    className="flex items-center justify-between w-full mb-6 group"
                                >
                                    <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text group-hover:scale-105 transition">📁 Resources & Materials</h3>
                                    <div className="text-cyan-400 p-2 bg-slate-700/50 rounded-lg group-hover:bg-purple-600/50 transition">
                                        {expandedSections.resources ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                                    </div>
                                </button>

                                {expandedSections.resources && (
                                    <div className="space-y-3">
                                        {(course?.resources || []).map((resource) => (
                                            <a
                                                key={resource._id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download={isPdf(resource.url)}
                                                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-lg hover:from-purple-600/40 hover:to-cyan-600/40 transition border border-purple-500/20 hover:border-purple-500/50 group"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-white font-semibold group-hover:text-cyan-300 transition">{resource.title}</p>
                                                    <p className="text-purple-300 text-sm">{resource.type}</p>
                                                </div>
                                                <div className="text-cyan-400 group-hover:text-pink-400 transition flex-shrink-0 p-2 bg-slate-700/50 rounded-lg">
                                                    <FiDownload size={20} />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Course Playlist */}
                    <div className="w-full lg:w-96">
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden w-full flex items-center justify-between p-6 text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl mb-4 border border-purple-400/50 hover:shadow-lg transition"
                        >
                            📚 Course Content ({(course.videos || []).length} videos)
                            {sidebarOpen ? <FiX /> : <FiMenu />}
                        </button>

                        {/* Sidebar Content */}
                        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-purple-500/30 backdrop-blur overflow-hidden shadow-xl`}>
                            <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/50 to-slate-900/50">
                                <h3 className="text-white font-bold text-lg">
                                    📚 Course Content ({(course.videos || []).length} videos)
                                </h3>
                            </div>

                            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                                {(course.videos || []).length === 0 ? (
                                    <p className="text-purple-300 p-6">No videos yet</p>
                                ) : (
                                    (course?.videos || []).map((video, idx) => (
                                        <button
                                            key={video._id}
                                            onClick={() => {
                                                setSelectedVideo(video);
                                                setSidebarOpen(false);
                                            }}
                                            className={`w-full text-left p-4 border-b border-purple-500/10 transition transform hover:scale-105 ${selectedVideo?._id === video._id
                                                ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-l-4 border-l-cyan-400'
                                                : 'hover:bg-slate-700/50'
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 pt-1">
                                                    <div className={`p-2 rounded-lg ${selectedVideo?._id === video._id ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' : 'bg-slate-700/50 text-purple-400'}`}>
                                                        <FiPlay size={16} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-semibold text-sm line-clamp-2 ${selectedVideo?._id === video._id ? 'text-cyan-300' : 'text-white'}`}>
                                                        {idx + 1}. {video?.title || 'Video'}
                                                    </h4>
                                                    <p className="text-purple-400 text-xs mt-1">⏱️ {video?.duration || 'N/A'} min</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Checkout Modal */}
            {showPaymentModal && (
                <PaymentCheckout
                    course={course}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
