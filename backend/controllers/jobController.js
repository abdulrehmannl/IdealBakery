const JobApplication = require('../models/JobApplication');

// @desc    Submit a new job application
// @route   POST /api/jobs
// @access  Public
const submitApplication = async (req, res, next) => {
    try {
        const { fullName, phone, whatsapp, position, experience, city } = req.body;

        const application = await JobApplication.create({
            fullName,
            phone,
            whatsapp,
            position,
            experience,
            city
        });

        res.status(201).json({
            success: true,
            data: application,
            message: 'Job application submitted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all job applications
// @route   GET /api/jobs
// @access  Private (Admin/Manager)
const getApplications = async (req, res, next) => {
    try {
        const applications = await JobApplication.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update job application status
// @route   PUT /api/jobs/:id/status
// @access  Private (Admin/Manager)
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        const application = await JobApplication.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: `No application found with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: application,
            message: 'Application status updated'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitApplication,
    getApplications,
    updateApplicationStatus
};
