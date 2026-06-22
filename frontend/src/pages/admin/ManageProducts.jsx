import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';

/**
 * ManageProducts Page
 * ====================
 * Lets admin staff view, search, filter, add, edit, and delete products.
 * Route: /admin/products
 */



// Empty form state — used when opening the Add New form or clearing after submit
const EMPTY_FORM = {
    name: '', description: '', category: 'Bakery Items', price: '', discount: 0,
    weight: '', stock: '', tags: '', isAvailable: true, isSugarFree: false,
    image: '', branch: 'Both',
};

const ManageProducts = () => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [branchesList, setBranchesList] = useState([]);
    const [products, setProducts]       = useState([]);
    const [search, setSearch]           = useState('');
    const [filterCat, setFilterCat]     = useState('All');
    const [showForm, setShowForm]       = useState(false);
    const [editId, setEditId]           = useState(null);   // null = adding new, number = editing
    const [form, setForm]               = useState(EMPTY_FORM);
    const [deleteId, setDeleteId]       = useState(null);   // shows confirm dialog when set
    const [isLoading, setIsLoading]     = useState(true);

    const fetchInitialData = async () => {
        try {
            const [prodRes, catRes, branchRes] = await Promise.all([
                api.get('/api/products'),
                api.get('/api/categories'),
                api.get('/api/branches')
            ]);
            
            if (catRes.data.success) {
                setCategoriesList(catRes.data.data);
            }
            if (branchRes.data.success) {
                setBranchesList(branchRes.data.data);
            }
            
            if (prodRes.data.success) {
                setProducts(prodRes.data.data.map(p => ({
                    ...p,
                    id: p._id,
                    branchName: p.branch && p.branch.length ? p.branch.map(b => b.name).join(', ') : 'Both',
                    categoryName: p.category ? p.category.name : 'Unknown'
                })));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchInitialData(); }, []);

    // ── Derived: filtered product list ──
    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat    = filterCat === 'All' || p.categoryName === filterCat;
        return matchSearch && matchCat;
    });

    // ── Open Add form ──
    const openAdd = () => {
        setForm({
            ...EMPTY_FORM,
            category: (categoriesList || []).length > 0 ? categoriesList[0]._id : '',
            branch: (branchesList || []).length > 0 ? branchesList[0]._id : ''
        });
        setEditId(null);
        setShowForm(true);
    };

    // ── Open Edit form pre-filled with product data ──
    const openEdit = (product) => {
        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            discount: product.discount || 0,
            weight: product.weight || '',
            stock: product.stock || 0,
            tags: product.tags && Array.isArray(product.tags) ? product.tags.join(', ') : '',
            isAvailable: product.isAvailable,
            isSugarFree: product.isSugarFree,
            image: product.image || '',
            category: product.category && typeof product.category === 'object' ? product.category._id : product.category,
            branch: product.branch && Array.isArray(product.branch) && product.branch[0] ? product.branch[0]._id : product.branch
        });
        setEditId(product.id);
        setShowForm(true);
    };

    // ── Handle form field changes ──
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/api/products/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setForm(prev => ({ ...prev, image: res.data.url }));
            }
        } catch (err) {
            console.error('Image upload failed', err);
            alert('Failed to upload image.');
        }
    };

    // ── Submit form (Add or Edit) ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
        const payload = { 
            ...form, 
            tags: tagsArray, 
            price: +form.price, 
            discount: +form.discount, 
            stock: +form.stock,
            branch: form.branch ? [form.branch] : [] // Backend expects array of object IDs
        };
        
        try {
            if (editId !== null) {
                await api.put(`/api/products/${editId}`, payload);
            } else {
                await api.post('/api/products', payload);
            }
            fetchInitialData();
            setShowForm(false);
        } catch (err) {
            console.error('Error saving product', err);
        }
    };

    // ── Delete product ──
    const confirmDelete = async () => {
        try {
            await api.delete(`/api/products/${deleteId}`);
            fetchInitialData();
            setDeleteId(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-5">

            {/* ── Top Controls: Search + Filter + Add Button ── */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
                {/* Search input */}
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
                    />
                </div>
                <div className="flex gap-3 items-center">
                    {/* Category filter */}
                    <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                        className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="All">All Categories</option>
                        {(categoriesList || []).map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                    {/* Add New button */}
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        style={{ backgroundColor: '#8B1A1A' }}>
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* ── Products Table ── */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                                {['Image','Name','Category','Price','Discount','Stock','Branch','Status','Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(product => (
                                <tr key={product.id} className={`hover:bg-secondary/20 transition-colors ${product.stock < 10 ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}>
                                    <td className="px-4 py-3">
                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                                    </td>
                                    <td className="px-4 py-3 font-bold text-text-dark whitespace-nowrap">
                                        {product.name}
                                        {product.stock < 10 && <span className="ml-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Low Stock</span>}
                                    </td>
                                    <td className="px-4 py-3 text-text-light text-xs">{product.categoryName}</td>
                                    <td className="px-4 py-3 font-semibold">Rs. {product.price}</td>
                                    <td className="px-4 py-3 text-text-light">{product.discount}%</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-bold text-xs ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-light text-xs">{product.branchName}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {product.isAvailable ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(product)}
                                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => setDeleteId(product.id)}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={9} className="text-center py-12 text-text-light">No products found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Add/Edit Form Modal ── */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h3 className="font-heading font-bold text-xl text-text-dark">
                                {editId !== null ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Product Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} required
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            {/* Description */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                            </div>
                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Category *</label>
                                <select name="category" value={form.category} onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                                    {(categoriesList || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            {/* Branch */}
                            <div>
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Branch</label>
                                <select name="branch" value={form.branch} onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                                    {(branchesList || []).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                </select>
                            </div>
                            {/* Price */}
                            <div>
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Price (Rs.) *</label>
                                <input name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            {/* Discount */}
                            <div>
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Discount (%)</label>
                                <input name="discount" type="number" value={form.discount} onChange={handleChange} min="0" max="100"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            {/* Weight */}
                            <div>
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Weight / Size</label>
                                <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 1kg, 250ml"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            {/* Stock */}
                            <div>
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Stock Qty *</label>
                                <input name="stock" type="number" value={form.stock} onChange={handleChange} required min="0"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            {/* Tags */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Tags (comma separated)</label>
                                <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. cake, birthday, chocolate"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            {/* Image URL */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">Product Image</label>
                                <div className="flex items-center gap-3">
                                    <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL (or upload below)"
                                        className="flex-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                    <label className="cursor-pointer px-4 py-2.5 bg-secondary text-primary font-bold text-sm rounded-lg hover:bg-primary/10 transition-colors border border-primary/20">
                                        Upload
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                {form.image && <img src={form.image} alt="Preview" className="mt-3 w-20 h-20 object-cover rounded-lg border border-border" />}
                            </div>
                            {/* Toggles */}
                            <div className="flex items-center gap-6 col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="w-4 h-4 accent-primary" />
                                    <span className="text-sm font-semibold text-text-dark">Available</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isSugarFree" checked={form.isSugarFree} onChange={handleChange} className="w-4 h-4 accent-primary" />
                                    <span className="text-sm font-semibold text-text-dark">Sugar-Free</span>
                                </label>
                            </div>
                            {/* Submit */}
                            <div className="col-span-2 flex gap-3 pt-2">
                                <button type="submit"
                                    className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#8B1A1A' }}>
                                    <Check size={15} />
                                    {editId !== null ? 'Save Changes' : 'Add Product'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Dialog ── */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                        <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Delete Product?</h3>
                        <p className="text-text-light text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={confirmDelete}
                                className="px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 transition-colors">
                                Yes, Delete
                            </button>
                            <button onClick={() => setDeleteId(null)}
                                className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ManageProducts;
/*
 * END OF FILE SUMMARY
 * Route: /admin/products
 * Features: Search filter, category filter, add/edit modal form, delete confirm dialog.
 * Schema fields used: name, description, category, price, discount, weight, stock, tags, isAvailable, isSugarFree, image, branch
 * TODO: Connect to GET/POST/PUT/DELETE /api/products
 */
