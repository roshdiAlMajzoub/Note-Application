const { validationResult } = require('express-validator/check');
const Category = require('../models/category');
const User = require('../models/user');
const Note = require('../models/note');

// an api that get the categories of the notes belongs to a user
exports.getCategories = (req, res, next) => {
    Category.find({ creator: req.userId })
        .then(categories => {
            res.status(200).json({ message: 'Fetched Categories Successfully.', categories: categories });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// an api that create a category

exports.createCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, Category name should not be empty.');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    let creator;
    let categoryCopy;
    Category.findOne({ name: name, creator: req.userId })
        .then(categ => {
            if (categ) {
                const error = new Error('Category already exists');
                error.statusCode = 404;
                throw error;
            }
            const category = new Category({
                name: name,
                creator: req.userId,
            });
            categoryCopy = category;
            return category.save();
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.categories.push(categoryCopy);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Category created succefully',
                category: categoryCopy,
                creator: { _id: creator._id, name: creator.name }
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

//  an api that get a specific category

exports.getCategory = (req, res, next) => {
    const categId = req.params.categId;
    Category.findById(categId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Category fetched.', category: category });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

// an api that update a category
exports.updateCategory = (req, res, next) => {
    const categId = req.params.categId;
    const name = req.body.name;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    Category.findById(categId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            if (category.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            category.name = name;
            return category.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Category Updated', category: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

//  an api that delete a category
exports.deleteCategory = (req, res, next) => {
    const categId = req.params.categId;
    Category.findById(categId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            if (category.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            return Category.findByIdAndRemove(categId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.categories.pull(categId);
            user.save();
            return Note.deleteMany({ category: categId })
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted Category.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}