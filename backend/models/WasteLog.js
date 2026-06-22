const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    reason: {
        type: String,
        enum: ['Expired', 'Burnt', 'Unsold', 'Damaged', 'Other'],
        required: [true, 'Reason is required']
    },
    loggedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('WasteLog', wasteLogSchema);
