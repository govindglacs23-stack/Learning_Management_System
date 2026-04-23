// Payment model for tracking course payments
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student ID is required'],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Instructor ID is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Payment amount is required'],
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'],
            default: 'USD',
        },
        paymentMethod: {
            type: String,
            enum: ['credit_card', 'paypal', 'stripe', 'bank_transfer'],
            required: [true, 'Payment method is required'],
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        discount: {
            type: Number,
            default: 0,
        },
        discountCode: {
            type: String,
            default: null,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        certificatePaid: {
            type: Boolean,
            default: false,
        },
        certificateAmount: {
            type: Number,
            default: 0,
        },
        invoiceNumber: {
            type: String,
            unique: true,
        },
        paymentDate: {
            type: Date,
            default: null,
        },
        refundDate: {
            type: Date,
            default: null,
        },
        refundReason: {
            type: String,
            default: null,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
