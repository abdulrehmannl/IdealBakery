import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Factory } from 'lucide-react';

function ManageProduction() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [form, setForm] = useState({ batchName: '', quantityProduced: '', bakerName: '', status: 'Completed' });

    const fetchBatches = async () => {
        try {
            const res = await api.get('/api/production');
            setBatches(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBatches(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/production', form);
            setShowForm(false);
            setForm({ batchName: '', quantityProduced: '', bakerName: '', status: 'Completed' });
            fetchBatches();
        } catch (err) { alert('Failed to add batch'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete batch log?')) return;
        try {
            await api.delete(`/api/production/${id}`);
            fetchBatches();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text-dark">Production Logs</h1>
                    <p className="text-sm text-text-light">Track daily baking yields.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Log Batch
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-bold">Product / Batch Name</label><input required value={form.batchName} onChange={e=>setForm({...form, batchName: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Quantity</label><input type="number" required value={form.quantityProduced} onChange={e=>setForm({...form, quantityProduced: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Baker Name</label><input required value={form.bakerName} onChange={e=>setForm({...form, bakerName: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div>
                        <label className="text-sm font-bold">Status</label>
                        <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full border p-2 rounded">
                            <option>Planned</option><option>In Progress</option><option>Completed</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-text-dark text-white px-6 py-2 rounded text-sm font-bold col-span-2">Save Log</button>
                </form>
            )}

            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F5F0EB] text-text-dark font-heading">
                        <tr><th className="p-4">Batch/Product</th><th className="p-4">Qty</th><th className="p-4">Baker</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {batches.map(b => (
                            <tr key={b._id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold">{b.batchName}</td>
                                <td className="p-4">{b.quantityProduced}</td>
                                <td className="p-4">{b.bakerName}</td>
                                <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{b.status}</span></td>
                                <td className="p-4">{new Date(b.date).toLocaleDateString()}</td>
                                <td className="p-4 text-right"><button onClick={()=>handleDelete(b._id)} className="text-red-500"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageProduction;
