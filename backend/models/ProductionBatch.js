const mongoose = require('mongoose');

const productionBatchSchema = new mongoose.Schema({
    batchName: {
        type: String,
        required: [true, 'Batch name or product is required']
    },
    quantityProduced: {
        type: Number,
        required: [true, 'Quantity produced is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    bakerName: {
        type: String,
        required: [true, 'Baker name is required']
    },
    status: {
        type: String,
        enum: ['Planned', 'In Progress', 'Completed'],
        default: 'Completed'
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductionBatch', productionBatchSchema);
