const Recipe = require('../models/Recipe');

exports.getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: recipes.length, data: recipes });
    } catch (error) { next(error); }
};

exports.createRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.create(req.body);
        res.status(201).json({ success: true, data: recipe });
    } catch (error) { next(error); }
};

exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};
