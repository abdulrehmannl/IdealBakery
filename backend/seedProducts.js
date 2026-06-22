require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Branch = require('./models/Branch');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('Cleared existing products and categories.');

        // Get a branch
        let branch = await Branch.findOne({ isActive: true });
        if (!branch) {
            branch = await Branch.create({
                name: 'Main City Branch',
                address: '123 Main St',
                city: 'City',
                phone: '1234567890'
            });
            console.log('Created a default branch.');
        }

        // Create Categories
        const categoriesData = [
            { name: 'Cakes', description: 'Freshly baked cakes for all occasions', image: 'https://loremflickr.com/800/600/cake?lock=101' },
            { name: 'Traditional Sweets', description: 'Authentic Pakistani Mithai', image: 'https://loremflickr.com/800/600/dessert,sweet?lock=102' },
            { name: 'Fast Food & Snacks', description: 'Quick bites and savory treats', image: 'https://loremflickr.com/800/600/burger,snack?lock=103' },
            { name: 'Bread & Buns', description: 'Daily fresh bakery bread', image: 'https://loremflickr.com/800/600/bread?lock=104' },
            { name: 'Biscuits & Cookies', description: 'Crunchy tea-time companions', image: 'https://loremflickr.com/800/600/cookies?lock=105' }
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`Created ${createdCategories.length} categories.`);

        const categoryMap = createdCategories.reduce((acc, cat) => {
            acc[cat.name] = cat._id;
            return acc;
        }, {});

        // Create Products
        const productsData = [
            // Cakes
            {
                name: 'Black Forest Cake',
                description: 'Classic chocolate sponge cake layered with fresh whipped cream and cherries.',
                price: 1200,
                weight: '2 lbs',
                stock: 15,
                category: categoryMap['Cakes'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/cake,chocolate?lock=1'
            },
            {
                name: 'Pineapple Cake',
                description: 'Soft vanilla sponge with juicy pineapple chunks and light cream.',
                price: 1100,
                weight: '2 lbs',
                stock: 20,
                category: categoryMap['Cakes'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/cake,pineapple?lock=2'
            },
            {
                name: 'Chocolate Fudge Cake',
                description: 'Rich and dense chocolate cake covered in gooey chocolate fudge icing.',
                price: 1500,
                weight: '2.5 lbs',
                stock: 10,
                category: categoryMap['Cakes'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/cake,fudge?lock=3'
            },
            
            // Sweets
            {
                name: 'Gulab Jamun',
                description: 'Soft, melt-in-your-mouth milk solids deep fried and soaked in sugar syrup.',
                price: 800,
                weight: '1 kg',
                stock: 50,
                category: categoryMap['Traditional Sweets'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/sweets,indian?lock=4'
            },
            {
                name: 'Barfi',
                description: 'Traditional milk-based sweet fudge topped with silver leaf and nuts.',
                price: 900,
                weight: '1 kg',
                stock: 40,
                category: categoryMap['Traditional Sweets'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/dessert,indian?lock=5'
            },
            {
                name: 'Rasgulla',
                description: 'Spongy cottage cheese balls cooked in light sugar syrup.',
                price: 850,
                weight: '1 kg',
                stock: 30,
                category: categoryMap['Traditional Sweets'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/sweets,white?lock=6'
            },

            // Fast Food & Snacks
            {
                name: 'Chicken Patties',
                description: 'Flaky puff pastry filled with creamy shredded chicken.',
                price: 60,
                weight: '1 piece',
                stock: 100,
                category: categoryMap['Fast Food & Snacks'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/pastry,snack?lock=7'
            },
            {
                name: 'Zinger Burger',
                description: 'Crispy fried chicken thigh with mayo and lettuce in a sesame seed bun.',
                price: 350,
                weight: '1 serving',
                stock: 45,
                category: categoryMap['Fast Food & Snacks'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/burger,chicken?lock=8'
            },
            {
                name: 'Vegetable Samosa',
                description: 'Crispy pastry filled with spicy potatoes and peas.',
                price: 40,
                weight: '1 piece',
                stock: 150,
                category: categoryMap['Fast Food & Snacks'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/samosa,snack?lock=9'
            },

            // Bread & Buns
            {
                name: 'Milky Bread',
                description: 'Soft and sweet milky bread loaf, perfect for breakfast.',
                price: 120,
                weight: '1 loaf',
                stock: 60,
                category: categoryMap['Bread & Buns'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/bread,loaf?lock=10'
            },
            {
                name: 'Bran Bread',
                description: 'Healthy whole wheat and bran loaf.',
                price: 150,
                weight: '1 loaf',
                stock: 40,
                category: categoryMap['Bread & Buns'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/bread,brown?lock=11'
            },
            {
                name: 'Burger Buns',
                description: 'Soft sesame seed burger buns.',
                price: 80,
                weight: '4 pieces',
                stock: 80,
                category: categoryMap['Bread & Buns'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/bun,bread?lock=12'
            },

            // Biscuits
            {
                name: 'Zeera Biscuits',
                description: 'Salty and crispy biscuits baked with roasted cumin seeds.',
                price: 400,
                weight: '500g',
                stock: 40,
                category: categoryMap['Biscuits & Cookies'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/biscuit,cookie?lock=13'
            },
            {
                name: 'Chocolate Chip Cookies',
                description: 'Buttery cookies loaded with dark chocolate chips.',
                price: 500,
                weight: '500g',
                stock: 35,
                category: categoryMap['Biscuits & Cookies'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/cookie,chocolate?lock=14'
            },
            {
                name: 'Nan Khatai',
                description: 'Traditional crumbly shortbread cookies made with ghee.',
                price: 450,
                weight: '500g',
                stock: 50,
                category: categoryMap['Biscuits & Cookies'],
                branch: [branch._id],
                image: 'https://loremflickr.com/800/600/cookie,baking?lock=15'
            }
        ];

        const createdProducts = await Product.insertMany(productsData);
        console.log(`Created ${createdProducts.length} products.`);

        console.log('Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedDatabase();
