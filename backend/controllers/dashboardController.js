const User = require('../models/User');
const Order = require('../models/Order');

const getDashboardStats = async (req, res, next) => {
    try {
        // Customers count
        const totalUsers = await User.countDocuments({ role: 'customer' });
        
        // Staff count
        const totalStaff = await User.countDocuments({ role: { $ne: 'customer' } });

        // Orders metrics
        const orders = await Order.find();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Recent orders (last 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'name phone')
            .populate('branch', 'name');

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStaff,
                totalOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats };
