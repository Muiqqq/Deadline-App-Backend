const express = require('express');
const todos = express.Router();
const database = require('../database/crudrepository.js');

// Get All
todos.get('/', async (req, res) => {
  await database.connect();
  try {
    res.send(await database.findAll());
  } catch (err) {
    res.status(500).send(err);
  }

  await database.close();
});

module.exports = todos;
