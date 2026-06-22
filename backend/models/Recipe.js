const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    ingredients: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true } // e.g. kg, grams, ml, pcs
    }],
    instructions: {
        type: String,
        required: [true, 'Instructions are required']
    },
    prepTime: {
        type: String,
        required: [true, 'Preparation time is required'] // e.g. "2 hours"
    }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
