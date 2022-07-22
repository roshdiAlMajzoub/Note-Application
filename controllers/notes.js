const { validationResult } = require('express-validator/check');
const Note = require('../models/note');
const User = require('../models/user');
const Category = require('../models/category');
const Tag = require('../models/tag');
const note = require('../models/note');


// an api that returns the notes for the user sorted by updateAt
exports.getNotes = (req, res, next) => {
    let notes;
    let category;
    Note.find( {creator: req.userId})
    .sort({updatedAt:-1})
    .populate('category')
    .populate('tags')
    .then(result => {
        res.status(200).json({ message: 'Note fetched.', notes: result});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    
};

// an api that create note 
// it take the content, categoryName, categoryId and tags array from body

exports.createNote = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).
            json({
                message: 'Validation failed, entered data is incorrect.',
                errors: errors.array()
            });
    }
    const content = req.body.content;
    const categoryName = req.body.categoryName;
    const categoryId = req.body.categoryId;
    const tags = req.body.tags;
    let creator;
    let noteCopy;
    let tagsCopy;
    let categoryCopy;
    let tagarr = [];
    Category.findById(categoryId)
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


            categoryCopy = category;
            return User.findById(req.userId);
        })
        .then(async user => {
            for (const t in tags) {
                let userCopy;
                // let tagCopy;

                let tagCopy = await Tag.findOne({ title: tags[t], creator: req.userId })
                console.log("roshdiiiiiiiiiiiiiiiiii")
                console.log(tagCopy);

                if (tagCopy == null) {
                    const tag = new Tag({
                        title: tags[t],
                        creator: req.userId,
                    })
                    user.tags.push(tag)
                    tag.save();
                    tagarr.push(tag);
                }

                if (tagCopy != null) {
                    tagarr.push(tagCopy);
                }
                tagCopy = null;
            }
            user.save();
            return tagarr;
        })
        .then(result => {
            const note = new Note({
                content: content,
                category: categoryCopy,
                creator: req.userId,
                tags: result
            });

            noteCopy = note;
            return note.save();
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.notes.push(noteCopy);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Note added succefully',
                note: noteCopy,
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


// an api that return a specific note it just need the note id that will take it from url params

exports.getNote = (req, res, next) => {
    const noteId = req.params.noteId;
    let noteCopy;
    let categoryCopy;
    let tags;
    Note.findById(noteId)
    .populate('category')
    .populate('tags')
    .then(note => {
        if (!note) {
            const error = new Error('Could not find note.');
            error.statusCode = 404;
            throw error;
        }
        if (note.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        res.status(200).json({ message: 'Note fetched.', note: note});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

// an api that update the content and tags of a note

exports.updateNote =async  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).
            json({
                message: 'Validation failed, entered data is incorrect.',
                errors: errors.array()
            });
    }
    const content = req.body.content;
    const noteId =  req.params.noteId;
    const tags = req.body.tags;
    let tagarr = [];

    for (const t in tags) {
        let userCopy;
        // let tagCopy;

        let tagCopy = await Tag.findOne({ title: tags[t], creator: req.userId })
        console.log("roshdiiiiiiiiiiiiiiiiii")
        console.log(tagCopy);

        if (tagCopy == null) {
            const tag = new Tag({
                title: tags[t],
                creator: req.userId,
            })
            user.tags.push(tag)
            tag.save();
            tagarr.push(tag);
        }

        if (tagCopy != null) {
            tagarr.push(tagCopy);
        }
        tagCopy = null;
    }
    Note.findById(noteId)
    .then(note => {
        if (!note) {
            const error = new Error('Could not find note.');
            error.statusCode = 404;
            throw error;
        }
        if (note.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }

        note.content = content;
        note.tags = tagarr;
        return note.save();
    })
    .then(result => {
        res.status(200).json({ message: 'Note Updated', note: result });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

}


// an api that delete a note 

exports.deleteNote = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).
            json({
                message: 'Validation failed, entered data is incorrect.',
                errors: errors.array()
            });
    }
    const noteId = req.params.noteId;
    Note.findById(noteId)
    .then(note => {
        if (!note) {
            const error = new Error('Could not find note.');
            error.statusCode = 404;
            throw error;
        }
        if (note.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        return Note.findByIdAndRemove(noteId);
    })
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        user.notes.pull(noteId);
        return user.save();
    })
    .then(result => {
        res.status(200).json({ message: 'Deleted note.' });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

}