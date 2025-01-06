const express = require('express');
const categories = require('../routes/categories');
const food = require('../routes/food');
const users = require('../routes/users');
const userGroups = require('../routes/userGroups');
const register = require('../routes/register');
const auth = require('../routes/auth');

module.exports = function(app){
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/categories', categories);
    app.use('/api/food', food)
    app.use('/api/users', users);
    app.use('/api/userGroups', userGroups);
    app.use('/api/register', register);
    app.use('/api/auth', auth);
}