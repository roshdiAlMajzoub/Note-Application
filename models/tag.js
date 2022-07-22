const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Tag', tagSchema);