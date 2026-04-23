import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';

export default function CourseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lessonForm, setLessonForm] = useState({
        type: 'video',
        title: '',
        url: '',
        description: '',
        duration: 0,
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await courseAPI.getCourse(id);
                const courseData = response.data.course;

                setCourse(courseData);
                const initialLessons = courseData.lessons && courseData.lessons.length > 0
                    ? courseData.lessons
                    : [
                        ...(courseData.videos || []).map((v) => ({
                            _id: v._id,
                            type: 'video',
                            title: v.title,
                            url: v.videoUrl || '',
                            description: v.description || '',
                            duration: v.duration || 0,
                        })),
                        ...(courseData.resources || []).map((r) => ({
                            _id: r._id,
                            type: r.type || 'other',
                            title: r.title,
                            url: r.url,
                            description: r.description || '',
                            duration: 0,
                        })),
                    ];

                setLessons(initialLessons);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    const handleAddLesson = (e) => {
        e.preventDefault();
        if (!lessonForm.title || !lessonForm.url) return;

        const newLesson = {
            ...lessonForm,
            // Temporary UI-only id so key works; not sent as _id to backend.
            _id: `tmp-${Date.now()}`,
            thumbnail: lessonForm.type === 'video' ? getYoutubeThumbnailUrl(lessonForm.url) : '',
        };

        setLessons((prev) => [...prev, newLesson]);
        setLessonForm({ type: 'video', title: '', url: '', description: '', duration: 0 });
    };

    const handleRemoveLesson = (lessonId) => {
        setLessons((prev) => prev.filter((lesson) => lesson._id.toString() !== lessonId.toString()));
    };

    const moveLesson = (index, direction) => {
        setLessons((prev) => {
            const newLessons = [...prev];
            const [removed] = newLessons.splice(index, 1);
            newLessons.splice(index + direction, 0, removed);
            return newLessons;
        });
    };

    const getYoutubeVideoId = (url) => {
        if (!url) return null;
        const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const match = url.match(ytRegex);
        return match ? match[1] : null;
    };

    const getYoutubeThumbnailUrl = (url) => {
        const id = getYoutubeVideoId(url);
        return id ? `https://img.youtube.com/vi/${id}/0.jpg` : '';
    };

    const handleSaveLessons = async () => {
        try {
            const cleanLessons = lessons.map((lesson) => ({
                type: lesson.type || 'video',
                title: lesson.title || '',
                url: lesson.url || '',
                description: lesson.description || '',
                duration: Number(lesson.duration) || 0,
                thumbnail: lesson.thumbnail || (lesson.type === 'video' ? getYoutubeThumbnailUrl(lesson.url) : ''),
                ...(lesson._id && lesson._id.startsWith('tmp-') ? {} : { _id: lesson._id }),
            }));

            await courseAPI.updateCourse(id, { lessons: cleanLessons });
            alert('Lesson order saved!');
            navigate('/instructor-dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save lessons');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">Course not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light dark:bg-dark py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark dark:text-white">Edit Lessons for {course.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Create a Udemy-style lesson sequence: video, pdf, document, etc.</p>
                    </div>
                    <button
                        onClick={() => navigate('/instructor-dashboard')}
                        className="bg-gray-200 dark:bg-gray-700 text-dark dark:text-white px-4 py-2 rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4 text-dark dark:text-white">Lesson sequence</h2>
                        {lessons.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No lessons yet. Add one from the form.</p>
                        ) : (
                            <ul className="space-y-3">
                                {lessons.map((lesson, idx) => (
                                    <li key={lesson._id} className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-900">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                {lesson.type === 'video' && lesson.thumbnail && (
                                                    <div className="relative group cursor-pointer mb-2">
                                                        <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-24 object-cover rounded" />
                                                        <div className="absolute inset-0 flex items-center justify-center rounded bg-black bg-opacity-30 group-hover:bg-opacity-50 transition">
                                                            <button
                                                                type="button"
                                                                onClick={() => window.open(lesson.url, '_blank')}
                                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition"
                                                            >
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <h3 className="font-semibold text-dark dark:text-white">{idx + 1}. [{lesson.type}] {lesson.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
                                                <a href={lesson.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-300">Open link</a>
                                                {lesson.type === 'video' && lesson.duration ? (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration: {lesson.duration} min</p>
                                                ) : null}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    disabled={idx === 0}
                                                    onClick={() => moveLesson(idx, -1)}
                                                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white rounded disabled:opacity-40"
                                                >
                                                    Up
                                                </button>
                                                <button
                                                    disabled={idx === lessons.length - 1}
                                                    onClick={() => moveLesson(idx, 1)}
                                                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white rounded disabled:opacity-40"
                                                >
                                                    Down
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveLesson(lesson._id)}
                                                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-700 text-red-700 dark:text-white rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4 text-dark dark:text-white">Add lesson</h2>
                        <form onSubmit={handleAddLesson} className="space-y-3">
                            <div>
                                <label className="block text-sm text-dark dark:text-white mb-1">Type</label>
                                <select
                                    value={lessonForm.type}
                                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                                    className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-2"
                                >
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                    <option value="document">Document</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark dark:text-white mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={lessonForm.title}
                                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-dark dark:text-white mb-1">URL</label>
                                <input
                                    type="url"
                                    required
                                    value={lessonForm.url}
                                    onChange={(e) => setLessonForm({ ...lessonForm, url: e.target.value })}
                                    className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-2"
                                />
                                {lessonForm.type === 'video' && lessonForm.url && getYoutubeVideoId(lessonForm.url) && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                        <div className="relative group cursor-pointer">
                                            <img
                                                src={getYoutubeThumbnailUrl(lessonForm.url)}
                                                alt="YouTube thumbnail"
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center rounded bg-black bg-opacity-30 group-hover:bg-opacity-50 transition">
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(lessonForm.url, '_blank')}
                                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition"
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-dark dark:text-white mb-1">Description</label>
                                <textarea
                                    value={lessonForm.description}
                                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                    className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-2"
                                    rows={3}
                                />
                            </div>
                            {lessonForm.type === 'video' && (
                                <div>
                                    <label className="block text-sm text-dark dark:text-white mb-1">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={lessonForm.duration}
                                        onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })}
                                        className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-2"
                                    />
                                </div>
                            )}
                            <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700">Add lesson</button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={handleSaveLessons} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save lesson sequence</button>
                    <button onClick={() => navigate('/instructor-dashboard')} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
            </div>
        </div>
    );
}
