const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const noteRoutes = require('./routes/notes');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();

app.use(bodyParser.json()); 

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET , POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next(); 
});

app.use('/notes', noteRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data });
});

mongoose.connect('mongodb+srv://roshdi:0r8qfhVVIwRwrKRl@cluster0.sk8bd.mongodb.net/note-app?retryWrites=true&w=majority')
.then(result => {
    app.listen(8080);
})
.catch(err => console.log(err));

