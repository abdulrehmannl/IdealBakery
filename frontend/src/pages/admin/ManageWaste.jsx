import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Trash } from 'lucide-react';

function ManageWaste() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [form, setForm] = useState({ productName: '', quantity: '', reason: 'Expired' });

    const fetchLogs = async () => {
        try {
            const res = await api.get('/api/waste');
            setLogs(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchLogs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/waste', form);
            setShowForm(false);
            setForm({ productName: '', quantity: '', reason: 'Expired' });
            fetchLogs();
        } catch (err) { alert('Failed to add waste log'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete log?')) return;
        try {
            await api.delete(`/api/waste/${id}`);
            fetchLogs();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text-dark">Waste & Spoilage</h1>
                    <p className="text-sm text-text-light">Track unsold or damaged goods.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Log Waste
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-bold">Product Name</label><input required value={form.productName} onChange={e=>setForm({...form, productName: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Quantity</label><input type="number" required value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div>
                        <label className="text-sm font-bold">Reason</label>
                        <select value={form.reason} onChange={e=>setForm({...form, reason: e.target.value})} className="w-full border p-2 rounded">
                            <option>Expired</option><option>Burnt</option><option>Unsold</option><option>Damaged</option><option>Other</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-text-dark text-white px-6 py-2 rounded text-sm font-bold col-span-2">Save Log</button>
                </form>
            )}

            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F5F0EB] text-text-dark font-heading">
                        <tr><th className="p-4">Product</th><th className="p-4">Quantity</th><th className="p-4">Reason</th><th className="p-4">Date</th><th className="p-4"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map(log => (
                            <tr key={log._id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold">{log.productName}</td>
                                <td className="p-4 text-red-600 font-bold">{log.quantity} units</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.reason==='Unsold' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {log.reason}
                                    </span>
                                </td>
                                <td className="p-4">{new Date(log.loggedDate).toLocaleDateString()}</td>
                                <td className="p-4 text-right"><button onClick={()=>handleDelete(log._id)} className="text-red-500"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageWaste;
