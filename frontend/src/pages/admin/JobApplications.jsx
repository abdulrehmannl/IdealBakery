import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Phone, MessageCircle } from 'lucide-react';
import api from '../../utils/api';

function JobApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/api/jobs');
            if (res.data.success) {
                setApplications(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/api/jobs/${id}/status`, { status: newStatus });
            setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Reviewed': return 'bg-blue-100 text-blue-700';
            case 'Contacted': return 'bg-purple-100 text-purple-700';
            case 'Hired': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text-dark mb-1">Job Applications</h1>
                    <p className="text-sm text-text-light">Manage and review candidates who applied online.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-border shadow-sm text-sm font-bold text-text-dark">
                    Total: {applications.length}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-text-light animate-pulse">Loading applications...</div>
            ) : applications.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border border-border text-center">
                    <Briefcase className="mx-auto w-12 h-12 text-text-light mb-3 opacity-50" />
                    <p className="text-text-light font-bold">No job applications received yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {applications.map(app => (
                        <div key={app._id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-border bg-[#F5F0EB]">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-heading font-bold text-lg text-text-dark">{app.fullName}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                                    <Briefcase size={12} />
                                    {app.position}
                                </div>
                            </div>

                            <div className="p-5 flex-1 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-text-dark">
                                        <MapPin size={14} className="text-text-light shrink-0" />
                                        {app.city}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-dark">
                                        <Phone size={14} className="text-text-light shrink-0" />
                                        {app.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-dark">
                                        <MessageCircle size={14} className="text-green-600 shrink-0" />
                                        <a href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline font-semibold">
                                            {app.whatsapp} (WhatsApp)
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-1.5">Experience</p>
                                    <div className="text-sm text-text-dark bg-secondary p-3 rounded-lg border border-border whitespace-pre-wrap max-h-32 overflow-y-auto">
                                        {app.experience}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border bg-gray-50 flex items-center justify-between">
                                <span className="text-xs text-text-light font-medium">
                                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                                <select 
                                    value={app.status}
                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                    className="text-xs font-bold border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Hired">Hired</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default JobApplications;
