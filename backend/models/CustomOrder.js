const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },
    requirements: {
        type: String,
        required: [true, 'Order requirements are required']
    },
    depositAmount: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Progress', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('CustomOrder', customOrderSchema);
