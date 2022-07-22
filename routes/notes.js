const express = require('express');
const { body } = require('express-validator/check')
const isAuth = require('../middleware/is-auth');

const noteController = require('../controllers/notes');

const router = express.Router();

// GET /notes/all-notes
router.get('/all-notes', isAuth, noteController.getNotes);

// POST /notes/note
router.post('/note', isAuth,
    [
        body('content')
            .trim()
            .notEmpty()
    ],
    noteController.createNote);

// PUT /notes/note/:
router.put('/note/:noteId', isAuth,
    [
        body('content')
            .trim()
            .notEmpty()
    ],
    noteController.updateNote);

// GET /notes/note/:
router.get('/note/:noteId', isAuth, noteController.getNote);

// DELETE /notes/note/:
router.delete('/note/:noteId', isAuth, noteController.deleteNote);

module.exports = router;