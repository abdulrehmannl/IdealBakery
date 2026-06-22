const WasteLog = require('../models/WasteLog');

exports.getWasteLogs = async (req, res, next) => {
    try {
        const logs = await WasteLog.find().sort({ loggedDate: -1 });
        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) { next(error); }
};

exports.createWasteLog = async (req, res, next) => {
    try {
        const log = await WasteLog.create(req.body);
        res.status(201).json({ success: true, data: log });
    } catch (error) { next(error); }
};

exports.deleteWasteLog = async (req, res, next) => {
    try {
        const log = await WasteLog.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
