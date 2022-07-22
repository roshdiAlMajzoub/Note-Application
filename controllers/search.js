const { validationResult } = require('express-validator/check');
const Note = require('../models/note');
const User = require('../models/user');
const Category = require('../models/category');
const Tag = require('../models/tag');
const note = require('../models/note');

// an api that retrieve the notes that belongs to specific category it need the category id that will get it from the url params

exports.viewNoteAccToCategory = (req, res, next) => {
    const categId = req.params.categId;
    Note.find({ category: categId, creator: req.userId })
        .populate('category')
        .populate('tags')
        .then(notes => {
            res.status(200).json({ message: 'notes retrieved', notes: notes })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

// an api for search for notes that belong to specific tag;
// it takes the tag title from the url

exports.searchByTags = async (req, res, next) => {
    let tag = req.params.tag;
    tag = '#' + tag;
    await Tag.findOne({ title: tag, creator: req.userId })
        .then(t => {
            console.log(t)
            console.log(t._id)
            if (!t) {
                const error = new Error('Could not find tag.');
                error.statusCode = 404;
                throw error;
            }
            console.log("notes array", t.notes)
            // return Note.find().where('_id').in(t.notes)
            return Note.find({ tags: t._id }).sort({updatedAt:-1})
        })
        .then(notes => {
            console.log(notes)
            res.status(200).json({ message: 'notes retrieved', notes: notes })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


// an api for  sort notes by update date, filter by category and search by tags

exports.filterBycategoryAndTag = (req, res, next) => {
    const categId = req.params.categId;
    let tags = req.params.tags;
    tags = tags.split('rosh'); // here tags are sent in url params added between them rosh keyword
    console.log("tags", tags);
    let tagarr = [];
    let categoryCopy;
    User.findById(req.userId)
        .then(async user => {
            for (t in tags) {
                tg = '#' + tags[t];
                let tag = await Tag.findOne({ title: tg, creator: req.userId });
                console.log(tag);
                if (tag) {
                    tagarr.push(tag._id);
                }
            }
            console.log('tagarr', tagarr)

            return Note.aggregate([
                { $match: { tags: { "$in": tagarr } } },
                { $sort: { 'updatedAt': -1 } },
                {
                    $group: {
                        '_id': { category: "$category" },
                        notes: { $push: '$$ROOT'},
                    }
                },
            ])
        })
        .then(async result => {
            
            if (result) {
                for (grp in result) {
                    let categId = result[grp]._id.category;
                    const category = await Category.findById(categId);
                    result[grp]._id.categoryName =  category.name;
                }
            }
            res.status(200).json({ message: 'notes retrieved', notes: result });
        })
}
