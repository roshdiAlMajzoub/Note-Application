const express = require('express');
const { body } = require('express-validator/check')
const categoryController = require('../controllers/categories');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /notes/all-notes
router.get('/all-categories', isAuth, categoryController.getCategories);

// POST /notes/note
router.post('/category', isAuth,
    [
        body('name')
            .trim()
            .notEmpty(),
    ],
    categoryController.createCategory);

router.get('/category/:categId', isAuth, categoryController.getCategory);

router.put('/category/:categId', isAuth,
    [
        body('name')
            .trim()
            .notEmpty(),
    ],
    categoryController.updateCategory);

router.delete('/category/:categId', isAuth, categoryController.deleteCategory);

module.exports = router;