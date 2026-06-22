import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit } from 'lucide-react';

function ManageSuppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [form, setForm] = useState({ companyName: '', contactPerson: '', phone: '', email: '', materialsSupplied: '' });

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/api/suppliers');
            setSuppliers(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchSuppliers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/suppliers', form);
            setShowForm(false);
            setForm({ companyName: '', contactPerson: '', phone: '', email: '', materialsSupplied: '' });
            fetchSuppliers();
        } catch (err) { alert('Failed to add supplier'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete supplier?')) return;
        try {
            await api.delete(`/api/suppliers/${id}`);
            fetchSuppliers();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text-dark">Suppliers</h1>
                    <p className="text-sm text-text-light">Manage vendor contacts and material info.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Add Supplier
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-bold">Company Name</label><input required value={form.companyName} onChange={e=>setForm({...form, companyName: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Contact Person</label><input required value={form.contactPerson} onChange={e=>setForm({...form, contactPerson: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Phone</label><input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Email</label><input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div className="col-span-2"><label className="text-sm font-bold">Materials Supplied</label><input required value={form.materialsSupplied} onChange={e=>setForm({...form, materialsSupplied: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. Flour, Sugar, Packaging" /></div>
                    <button type="submit" className="bg-text-dark text-white px-6 py-2 rounded text-sm font-bold col-span-2">Save Supplier</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map(sup => (
                    <div key={sup._id} className="bg-white p-5 rounded-xl border border-border shadow-sm relative">
                        <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded">{sup.status}</div>
                        <h3 className="font-heading font-bold text-lg text-primary">{sup.companyName}</h3>
                        <p className="text-sm text-text-dark font-bold mt-2">{sup.contactPerson}</p>
                        <p className="text-sm text-text-light">{sup.phone}</p>
                        <p className="text-sm text-text-light">{sup.email}</p>
                        <div className="mt-4 bg-gray-50 p-2 rounded border border-border text-xs text-text-dark">
                            <strong>Supplies:</strong> {sup.materialsSupplied}
                        </div>
                        <button onClick={()=>handleDelete(sup._id)} className="mt-4 text-red-500 text-sm font-bold flex items-center gap-1 hover:underline"><Trash2 size={14}/> Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageSuppliers;
