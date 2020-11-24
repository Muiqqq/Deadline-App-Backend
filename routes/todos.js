const express = require('express');
const todos = express.Router();
const database = require('../database/crudrepository.js');

// Get All
todos.get('/', (req, res) => {
  res.send('Get All!');
});

module.exports = todos;
