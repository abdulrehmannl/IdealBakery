const CustomOrder = require('../models/CustomOrder');

exports.getCustomOrders = async (req, res, next) => {
    try {
        const orders = await CustomOrder.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) { next(error); }
};

exports.createCustomOrder = async (req, res, next) => {
    try {
        const order = await CustomOrder.create(req.body);
        res.status(201).json({ success: true, data: order });
    } catch (error) { next(error); }
};

exports.updateCustomOrderStatus = async (req, res, next) => {
    try {
        const order = await CustomOrder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: order });
    } catch (error) { next(error); }
};

exports.deleteCustomOrder = async (req, res, next) => {
    try {
        const order = await CustomOrder.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
