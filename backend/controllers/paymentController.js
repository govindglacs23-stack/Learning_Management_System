// Payment Controller
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Process payment for course enrollment
exports.processPayment = async (req, res) => {
    try {
        const { courseId, paymentMethod, certificatePaid } = req.body;
        const studentId = req.user._id;

        // Validate payment method
        if (!['credit_card', 'paypal', 'stripe', 'bank_transfer'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method',
            });
        }

        // Get course details
        const course = await Course.findById(courseId).populate('instructor');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Check if student already paid for this course
        const existingPayment = await Payment.findOne({
            student: studentId,
            course: courseId,
            status: 'completed',
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'You have already paid for this course',
            });
        }

        // Calculate payment amount
        let originalPrice = course.price || 0;
        let discount = course.discount || 0;
        let discountedPrice = originalPrice - (originalPrice * discount) / 100;
        let certificateAmount = certificatePaid ? course.certificatePrice || 0 : 0;
        let finalPrice = discountedPrice + certificateAmount;

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${studentId.toString().slice(-4)}`;

        // Create payment record
        const payment = await Payment.create({
            student: studentId,
            course: courseId,
            instructor: course.instructor._id,
            amount: finalPrice,
            currency: course.currency || 'USD',
            paymentMethod,
            originalPrice,
            finalPrice,
            discount,
            certificatePaid,
            certificateAmount,
            invoiceNumber,
            status: 'pending',
        });

        // In a real scenario, you would integrate with payment gateway here
        // For now, we'll simulate successful payment
        payment.status = 'completed';
        payment.paymentDate = new Date();
        payment.transactionId = `TXN-${Date.now()}`;
        await payment.save();

        // Update or create enrollment
        let enrollment = await Enrollment.findOne({ student: studentId, course: courseId });

        if (!enrollment) {
            enrollment = await Enrollment.create({
                student: studentId,
                course: courseId,
                paymentStatus: 'paid',
                paymentId: payment._id,
                amountPaid: finalPrice,
                paidDate: new Date(),
                paymentMethod,
                certificatePaid,
            });
        } else {
            enrollment.paymentStatus = 'paid';
            enrollment.paymentId = payment._id;
            enrollment.amountPaid = finalPrice;
            enrollment.paidDate = new Date();
            enrollment.paymentMethod = paymentMethod;
            enrollment.certificatePaid = certificatePaid;
            await enrollment.save();
        }

        // Add student to course students array
        if (!course.students.includes(studentId)) {
            course.students.push(studentId);
            course.totalStudents = course.students.length;
            await course.save();
        }

        res.status(201).json({
            success: true,
            message: 'Payment processed successfully',
            payment: {
                _id: payment._id,
                invoiceNumber: payment.invoiceNumber,
                transactionId: payment.transactionId,
                amount: payment.finalPrice,
                currency: payment.currency,
                status: payment.status,
                paymentDate: payment.paymentDate,
                courseName: course.title,
            },
            enrollment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
    try {
        const studentId = req.user._id;

        const payments = await Payment.find({ student: studentId })
            .populate('course', 'title price')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: payments.length,
            payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('student', 'name email')
            .populate('course', 'title price instructor')
            .populate('instructor', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        res.status(200).json({
            success: true,
            payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Request refund
exports.requestRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { reason } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        if (payment.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to refund this payment',
            });
        }

        // Check if payment is eligible for refund
        const enrollmentDate = new Date(payment.createdAt);
        const currentDate = new Date();
        const daysDifference = Math.floor((currentDate - enrollmentDate) / (1000 * 60 * 60 * 24));

        const course = await Course.findById(payment.course);
        const refundPolicy = course.refundPolicy || '14_days';
        const refundDays = parseInt(refundPolicy.split('_')[0]);

        if (daysDifference > refundDays) {
            return res.status(400).json({
                success: false,
                message: `Refund window expired. Refunds are only available within ${refundDays} days of purchase.`,
            });
        }

        if (payment.status === 'refunded') {
            return res.status(400).json({
                success: false,
                message: 'This payment has already been refunded',
            });
        }

        // Process refund
        payment.status = 'refunded';
        payment.refundDate = new Date();
        payment.refundReason = reason || 'No reason provided';
        await payment.save();

        // Update enrollment
        const enrollment = await Enrollment.findOne({
            student: payment.student,
            course: payment.course,
        });

        if (enrollment) {
            enrollment.paymentStatus = 'refunded';
            await enrollment.save();
        }

        res.status(200).json({
            success: true,
            message: 'Refund request processed successfully',
            payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get instructor earnings
exports.getInstructorEarnings = async (req, res) => {
    try {
        const instructorId = req.user._id;

        const payments = await Payment.find({
            instructor: instructorId,
            status: 'completed',
        })
            .populate('course', 'title')
            .populate('student', 'name email');

        const totalEarnings = payments.reduce((sum, payment) => sum + payment.finalPrice, 0);
        const totalTransactions = payments.length;

        res.status(200).json({
            success: true,
            totalEarnings,
            totalTransactions,
            payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update payment status (Admin only)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status',
            });
        }

        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            { status },
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
