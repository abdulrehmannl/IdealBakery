const ProductionBatch = require('../models/ProductionBatch');

exports.getBatches = async (req, res, next) => {
    try {
        const batches = await ProductionBatch.find().sort({ date: -1 });
        res.status(200).json({ success: true, count: batches.length, data: batches });
    } catch (error) { next(error); }
};

exports.createBatch = async (req, res, next) => {
    try {
        const batch = await ProductionBatch.create(req.body);
        res.status(201).json({ success: true, data: batch });
    } catch (error) { next(error); }
};

exports.updateBatchStatus = async (req, res, next) => {
    try {
        const batch = await ProductionBatch.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!batch) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: batch });
    } catch (error) { next(error); }
};

exports.deleteBatch = async (req, res, next) => {
    try {
        const batch = await ProductionBatch.findByIdAndDelete(req.params.id);
        if (!batch) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
