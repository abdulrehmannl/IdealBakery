const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required']
    },
    contactPerson: {
        type: String,
        required: [true, 'Contact person is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    email: {
        type: String
    },
    materialsSupplied: {
        type: String,
        required: [true, 'Materials supplied description is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
