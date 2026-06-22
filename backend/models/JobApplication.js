const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    whatsapp: {
        type: String,
        required: [true, 'WhatsApp number is required']
    },
    position: {
        type: String,
        enum: ['Baker', 'Cashier', 'Delivery Rider', 'Cleaner', 'Manager'],
        required: [true, 'Position applied for is required']
    },
    experience: {
        type: String,
        required: [true, 'Experience details are required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Contacted', 'Rejected', 'Hired'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
