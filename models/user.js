const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new!'
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

module.exports = mongoose.model('User', userSchema);