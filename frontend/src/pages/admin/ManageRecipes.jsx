import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, BookOpen } from 'lucide-react';

function ManageRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [productName, setProductName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);

    const fetchRecipes = async () => {
        try {
            const res = await api.get('/api/recipes');
            setRecipes(res.data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchRecipes(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/recipes', { productName, instructions, prepTime, ingredients });
            setShowForm(false);
            setProductName(''); setInstructions(''); setPrepTime('');
            setIngredients([{ name: '', quantity: '', unit: '' }]);
            fetchRecipes();
        } catch (err) { alert('Failed to add recipe'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete recipe?')) return;
        try {
            await api.delete(`/api/recipes/${id}`);
            fetchRecipes();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text-dark">Recipes</h1>
                    <p className="text-sm text-text-light">Manage baking formulations.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Add Recipe
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold">Product Name</label><input required value={productName} onChange={e=>setProductName(e.target.value)} className="w-full border p-2 rounded" /></div>
                        <div><label className="text-sm font-bold">Prep Time</label><input required value={prepTime} onChange={e=>setPrepTime(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. 2 hours" /></div>
                    </div>
                    <div>
                        <label className="text-sm font-bold block mb-2">Ingredients</label>
                        {ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input placeholder="Name" value={ing.name} onChange={e => { const n=[...ingredients]; n[idx].name=e.target.value; setIngredients(n); }} className="border p-2 rounded flex-1 text-sm" required />
                                <input placeholder="Qty" type="number" value={ing.quantity} onChange={e => { const n=[...ingredients]; n[idx].quantity=e.target.value; setIngredients(n); }} className="border p-2 rounded w-24 text-sm" required />
                                <input placeholder="Unit" value={ing.unit} onChange={e => { const n=[...ingredients]; n[idx].unit=e.target.value; setIngredients(n); }} className="border p-2 rounded w-24 text-sm" required />
                            </div>
                        ))}
                        <button type="button" onClick={() => setIngredients([...ingredients, {name:'', quantity:'', unit:''}])} className="text-sm text-primary font-bold">+ Add Ingredient</button>
                    </div>
                    <div><label className="text-sm font-bold">Instructions</label><textarea required value={instructions} onChange={e=>setInstructions(e.target.value)} className="w-full border p-2 rounded h-24" /></div>
                    <button type="submit" className="bg-text-dark text-white px-6 py-2 rounded text-sm font-bold">Save Recipe</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map(recipe => (
                    <div key={recipe._id} className="bg-white p-5 rounded-xl border border-border shadow-sm">
                        <div className="flex justify-between">
                            <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2"><BookOpen size={18} /> {recipe.productName}</h3>
                            <button onClick={() => handleDelete(recipe._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-xs text-text-light mb-4">Prep time: {recipe.prepTime}</p>
                        <div className="text-sm text-text-dark whitespace-pre-wrap">{recipe.instructions}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageRecipes;
