// Payment Checkout Component
import { useState } from 'react';
import { FiX, FiCheck, FiCreditCard } from 'react-icons/fi';
import { paymentAPI, enrollmentAPI } from '../services/api';

export default function PaymentCheckout({ course, onClose, onSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [certificatePaid, setCertificatePaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const originalPrice = course?.price || 0;
    const discount = course?.discount || 0;
    const discountAmount = (originalPrice * discount) / 100;
    const discountedPrice = originalPrice - discountAmount;
    const certificatePrice = certificatePaid ? (course?.certificatePrice || 0) : 0;
    const finalPrice = discountedPrice + certificatePrice;

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Process payment
            const paymentResponse = await paymentAPI.processPayment({
                courseId: course._id,
                paymentMethod,
                certificatePaid,
            });

            if (paymentResponse.data.success) {
                alert('✅ Payment successful! You are now enrolled.');
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = {
        credit_card: { label: '💳 Credit/Debit Card', icon: '💳' },
        paypal: { label: '🅿️ PayPal', icon: '🅿️' },
        stripe: { label: '⚡ Stripe', icon: '⚡' },
        bank_transfer: { label: '🏦 Bank Transfer', icon: '🏦' },
    };

    const availableMethods = (course?.paymentMethods || ['credit_card']).filter(
        method => paymentMethods[method]
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-900/50 max-w-md w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
                    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                        💳 Checkout
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-purple-400 hover:text-pink-400 transition"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handlePayment} className="p-6 space-y-6">
                    {/* Course Summary */}
                    <div className="bg-slate-700/30 border border-purple-500/20 rounded-lg p-4">
                        <p className="text-purple-200 text-sm mb-1">Course</p>
                        <h3 className="text-lg font-semibold text-white mb-4">{course?.title}</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-purple-200">
                                <span>Original Price:</span>
                                <span>${originalPrice.toFixed(2)}</span>
                            </div>

                            {discount > 0 && (
                                <>
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({discount}%):</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-purple-500/20 pt-2 flex justify-between text-cyan-300 font-semibold">
                                        <span>Course Price:</span>
                                        <span>${discountedPrice.toFixed(2)}</span>
                                    </div>
                                </>
                            )}

                            {!certificatePaid && course?.certificatePrice > 0 && (
                                <div className="mt-3 pt-3 border-t border-purple-500/20">
                                    <p className="text-purple-300 text-xs mb-2">Add certificate for +${course.certificatePrice.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Certificate Option */}
                    {course?.certificateAvailable && (
                        <div className="bg-slate-700/30 border border-purple-500/20 rounded-lg p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={certificatePaid}
                                    onChange={(e) => setCertificatePaid(e.target.checked)}
                                    className="w-5 h-5 rounded accent-cyan-500"
                                />
                                <div>
                                    <p className="text-white font-semibold">Add Certificate</p>
                                    <p className="text-purple-300 text-sm">+${course?.certificatePrice?.toFixed(2) || '0.00'}</p>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* Payment Method Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-3">
                            Payment Method
                        </label>
                        <div className="space-y-2">
                            {availableMethods.map(method => (
                                <label
                                    key={method}
                                    className="flex items-center p-3 bg-slate-700/30 border border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/60 transition"
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 accent-cyan-500"
                                    />
                                    <span className="ml-3 text-white flex-1">
                                        {paymentMethods[method]?.label || method}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Price Summary */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-200">Subtotal:</span>
                            <span className="text-white font-semibold">${(discountedPrice + certificatePrice).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-purple-500/20 pt-2 flex justify-between items-center">
                            <span className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">Total Amount:</span>
                            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text">
                                ${finalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-900/30 border border-blue-500/30 text-blue-200 p-3 rounded-lg text-sm">
                        <p>✨ This is a demo payment. No actual charges will be made.</p>
                        <p className="mt-1 text-xs text-blue-300">Use any test card number for demo purposes.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-700/50 border border-purple-500/30 text-purple-200 py-3 rounded-lg font-semibold hover:bg-slate-600/50 hover:border-purple-500/60 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FiCheck size={18} />
                                    Pay ${finalPrice.toFixed(2)}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
