const express = require('express');
const { body } = require('express-validator/check')
const isAuth = require('../middleware/is-auth');

const searchController = require('../controllers/search');

const router = express.Router();

// GET /search/byCategory/:

router.get('/byCategory/:categId', isAuth, searchController.viewNoteAccToCategory);

// GET /search/byTagy/:

router.get('/byTag/:tag', isAuth, searchController.searchByTags);

// GET /search/byTagCategory/:

router.get('/byTagCategory/:tags', isAuth, searchController.filterBycategoryAndTag);


module.exports = router;
