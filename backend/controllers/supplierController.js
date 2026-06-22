const Supplier = require('../models/Supplier');

exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
    } catch (error) { next(error); }
};

exports.createSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ success: true, data: supplier });
    } catch (error) { next(error); }
};

exports.updateSupplierStatus = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!supplier) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: supplier });
    } catch (error) { next(error); }
};

exports.deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
