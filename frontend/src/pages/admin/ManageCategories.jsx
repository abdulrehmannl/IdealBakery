import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, ChevronRight } from 'lucide-react';

/**
 * ManageCategories Page
 * ======================
 * Allows admin to view, add, edit, and delete product categories.
 * Categories can be top-level (e.g. "Bakery Items") or
 * subcategories with a parent (e.g. "Pastries" under "Bakery Items").
 *
 * Route: /admin/categories
 *
 * TODO: Connect to:
 *   GET    /api/categories         → load all categories
 *   POST   /api/categories         → create new category
 *   PUT    /api/categories/:id     → update category
 *   DELETE /api/categories/:id     → delete category
 */

// ── DUMMY DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with real data from GET /api/categories
// Each category matches the Category mongoose schema:
//   name, description, parentCategory (null = top-level), isActive
const INITIAL_CATEGORIES = [
  // ── Top-level categories ──
  { id: 1, name: 'Fast Food',     description: 'Burgers, fries, wraps & more',        parentId: null, isActive: true  },
  { id: 2, name: 'Bakery Items',  description: 'Cakes, bread, pastries & baked goods', parentId: null, isActive: true  },
  { id: 3, name: 'Desi Items',    description: 'Traditional Pakistani mithai & snacks', parentId: null, isActive: true  },
  { id: 4, name: 'Desserts',      description: 'Sweets, puddings & sweet treats',       parentId: null, isActive: true  },
  { id: 5, name: 'Ice Cream',     description: 'Scoops, sundaes & frozen desserts',     parentId: null, isActive: true  },
  { id: 6, name: 'Beverages',     description: 'Juices, milkshakes, tea & coffee',      parentId: null, isActive: true  },

  // ── Sub-categories of Fast Food (parentId: 1) ──
  { id: 7,  name: 'Burgers',      description: 'All beef and chicken burgers',          parentId: 1, isActive: true  },
  { id: 8,  name: 'Wraps',        description: 'Shawarma and wrap rolls',               parentId: 1, isActive: true  },
  { id: 9,  name: 'Fries & Sides',description: 'French fries, nuggets, wings',          parentId: 1, isActive: true  },

  // ── Sub-categories of Bakery Items (parentId: 2) ──
  { id: 10, name: 'Cakes',        description: 'Birthday, wedding & custom cakes',      parentId: 2, isActive: true  },
  { id: 11, name: 'Bread',        description: 'White bread, bun & toast',             parentId: 2, isActive: true  },
  { id: 12, name: 'Pastries',     description: 'Croissants, tarts & puffs',            parentId: 2, isActive: false },

  // ── Sub-categories of Desi Items (parentId: 3) ──
  { id: 13, name: 'Mithai',       description: 'Gulab jamun, barfi, ladoo & more',     parentId: 3, isActive: true  },
  { id: 14, name: 'Desi Snacks',  description: 'Samosa, pakora, chaat',                parentId: 3, isActive: true  },

  // ── Sub-categories of Beverages (parentId: 6) ──
  { id: 15, name: 'Hot Drinks',   description: 'Tea, coffee, hot chocolate',           parentId: 6, isActive: true  },
  { id: 16, name: 'Cold Drinks',  description: 'Juices, milkshakes, cold brew',        parentId: 6, isActive: true  },
];

// Empty form — used when adding a new category
const EMPTY_FORM = {
  name: '',
  description: '',
  parentId: null,   // null = top-level category
  isActive: true,
};

function ManageCategories() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showForm, setShowForm]     = useState(false); // show/hide the modal form
  const [editId, setEditId]         = useState(null);  // null = adding new; number = editing
  const [form, setForm]             = useState(EMPTY_FORM);
  const [deleteId, setDeleteId]     = useState(null);  // triggers confirm dialog

  // ── Derived: list of top-level categories only (for parent dropdown) ───────
  // When adding/editing a category, the parent must be a top-level one
  const topLevel = categories.filter(c => c.parentId === null);

  /**
   * Get parent category name by id.
   * Returns '—' if no parent (top-level category).
   */
  const getParentName = (parentId) => {
    if (!parentId) return '—';
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : '—';
  };

  // ── Open Add form (blank) ──────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  // ── Open Edit form pre-filled ──────────────────────────────────────────────
  const openEdit = (cat) => {
    setForm({
      name:        cat.name,
      description: cat.description,
      parentId:    cat.parentId,
      isActive:    cat.isActive,
    });
    setEditId(cat.id);
    setShowForm(true);
  };

  // ── Handle any form field change ───────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      // If checkbox, use boolean; for parentId "null" string convert to null
      [name]: type === 'checkbox'
        ? checked
        : name === 'parentId'
          ? (value === 'null' ? null : Number(value))
          : value,
    }));
  };

  // ── Submit: Add or Edit ────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId !== null) {
      // TODO: PUT /api/categories/:editId  with form data
      setCategories(prev =>
        prev.map(c => c.id === editId ? { ...c, ...form } : c)
      );
    } else {
      // TODO: POST /api/categories  with form data
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories(prev => [...prev, { ...form, id: newId }]);
    }
    setShowForm(false);
  };

  // ── Delete confirmed ───────────────────────────────────────────────────────
  const confirmDelete = () => {
    // TODO: DELETE /api/categories/:deleteId
    // Also remove any subcategories whose parentId = deleteId
    setCategories(prev =>
      prev.filter(c => c.id !== deleteId && c.parentId !== deleteId)
    );
    setDeleteId(null);
  };

  // ── Separate categories into top-level and sub-categories for display ──────
  // Display order: each top-level category, then its children indented below
  const sorted = [
    ...categories.filter(c => c.parentId === null),
    ...categories.filter(c => c.parentId !== null),
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Top Controls ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-light font-body">
          {categories.length} categories total ({topLevel.length} top-level)
        </p>
        {/* Add New Category button */}
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* ── Categories Table ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border" style={{ backgroundColor: '#F5F0EB' }}>
                {/* Table column headers */}
                {['Name', 'Description', 'Parent Category', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-text-light text-xs tracking-wide uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map(cat => (
                <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">

                  {/* Name — subcategories are indented with an arrow */}
                  <td className="px-5 py-3 font-bold text-text-dark whitespace-nowrap">
                    {cat.parentId !== null && (
                      // This arrow shows it's a sub-category
                      <ChevronRight size={13} className="inline mr-1 text-text-light" />
                    )}
                    {cat.name}
                  </td>

                  {/* Description */}
                  <td className="px-5 py-3 text-text-light text-xs max-w-xs truncate">
                    {cat.description || '—'}
                  </td>

                  {/* Parent Category */}
                  <td className="px-5 py-3 text-text-light text-xs">
                    {getParentName(cat.parentId)}
                  </td>

                  {/* Active/Inactive badge */}
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      cat.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Edit / Delete buttons */}
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ADD / EDIT FORM MODAL
          Appears as an overlay on top of the page.
      ══════════════════════════════════════════════════════════════════════ */}
      {showForm && (
        // Dark backdrop
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-xl text-text-dark">
                {editId !== null ? 'Edit Category' : 'Add New Category'}
              </h3>
              {/* Close (X) button */}
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">
                  Category Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bakery Items"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Brief description of this category..."
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Parent Category dropdown */}
              <div>
                <label className="block text-xs font-bold text-text-light mb-1 uppercase tracking-wide">
                  Parent Category
                </label>
                <select
                  name="parentId"
                  value={form.parentId ?? 'null'}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {/* "null" value means top-level — no parent */}
                  <option value="null">— None (Top-Level Category) —</option>
                  {topLevel.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-text-light mt-1">
                  Leave as None to create a main category.
                </p>
              </div>

              {/* Active toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm font-semibold text-text-dark">Active</span>
                  <span className="text-xs text-text-light">(Inactive categories are hidden on the menu)</span>
                </label>
              </div>

              {/* Form action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#8B1A1A' }}
                >
                  <Check size={15} />
                  {editId !== null ? 'Save Changes' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DELETE CONFIRM DIALOG
      ══════════════════════════════════════════════════════════════════════ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            {/* Warning icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-dark mb-2">Delete Category?</h3>
            <p className="text-text-light text-sm mb-1">
              This will also delete all subcategories under it.
            </p>
            <p className="text-text-light text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-red-500 text-white font-bold text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-6 py-2.5 border border-border text-text-light font-bold text-sm rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageCategories;

/*
 * END OF FILE SUMMARY
 * =====================
 * Route:    /admin/categories
 * Features:
 *   - Table showing all categories (top-level + subcategories in sorted order)
 *   - Add/Edit modal form with fields: name, description, parentCategory, isActive
 *   - Delete with confirm dialog (also removes child subcategories)
 *   - Subcategories shown with a ChevronRight indent arrow
 *
 * Schema fields used:
 *   name, description, parentCategory (stored as parentId in state), isActive
 *
 * TODO: Connect all CRUD to /api/categories endpoints using axios
 */
