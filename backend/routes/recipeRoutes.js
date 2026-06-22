const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getRecipes, createRecipe, deleteRecipe } = require('../controllers/recipeController');

router.get('/', protect, getRecipes);
router.post('/', protect, createRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
