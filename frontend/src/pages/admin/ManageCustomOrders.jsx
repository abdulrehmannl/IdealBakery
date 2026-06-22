import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2 } from 'lucide-react';

function ManageCustomOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [form, setForm] = useState({ customerName: '', phone: '', eventDate: '', requirements: '', depositAmount: '', totalPrice: '' });

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/custom-orders');
            setOrders(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/custom-orders', form);
            setShowForm(false);
            setForm({ customerName: '', phone: '', eventDate: '', requirements: '', depositAmount: '', totalPrice: '' });
            fetchOrders();
        } catch (err) { alert('Failed to add order'); }
    };

    const handleStatus = async (id, status) => {
        try {
            await api.put(`/api/custom-orders/${id}/status`, { status });
            fetchOrders();
        } catch (err) { alert('Failed to update status'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete order?')) return;
        try {
            await api.delete(`/api/custom-orders/${id}`);
            fetchOrders();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text-dark">Special & Custom Orders</h1>
                    <p className="text-sm text-text-light">Manage large event or highly customized orders.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Create Order
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-bold">Customer Name</label><input required value={form.customerName} onChange={e=>setForm({...form, customerName: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Phone</label><input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Event Date</label><input type="date" required value={form.eventDate} onChange={e=>setForm({...form, eventDate: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Deposit Paid (Rs)</label><input type="number" value={form.depositAmount} onChange={e=>setForm({...form, depositAmount: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div><label className="text-sm font-bold">Total Price (Rs)</label><input type="number" required value={form.totalPrice} onChange={e=>setForm({...form, totalPrice: e.target.value})} className="w-full border p-2 rounded" /></div>
                    <div className="col-span-2"><label className="text-sm font-bold">Requirements / Notes</label><textarea required value={form.requirements} onChange={e=>setForm({...form, requirements: e.target.value})} className="w-full border p-2 rounded h-20" /></div>
                    <button type="submit" className="bg-text-dark text-white px-6 py-2 rounded text-sm font-bold col-span-2">Save Custom Order</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map(order => (
                    <div key={order._id} className="bg-white p-5 rounded-xl border border-border shadow-sm">
                        <div className="flex justify-between border-b pb-3 mb-3">
                            <div>
                                <h3 className="font-heading font-bold text-lg text-primary">{order.customerName}</h3>
                                <p className="text-xs text-text-light">{order.phone}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase">{order.status}</span>
                                <p className="text-xs font-bold mt-1">Due: {new Date(order.eventDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-sm text-text-dark whitespace-pre-wrap mb-4 bg-[#F5F0EB] p-3 rounded">{order.requirements}</div>
                        <div className="flex justify-between items-center text-sm font-bold mb-4">
                            <span>Deposit: Rs {order.depositAmount}</span>
                            <span>Total: Rs {order.totalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-4">
                            <select value={order.status} onChange={e => handleStatus(order._id, e.target.value)} className="border p-1 text-xs rounded font-bold">
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                            <button onClick={()=>handleDelete(order._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageCustomOrders;
