const express = require('express');
const router = express.Router();
const database = require('../database/crudrepository.js');

// Get All
router.get('/', async (req, res) => {
  await database.connect();
  try {
    res.send(await database.findAll());
  } catch (err) {
    res.status(500).send(err);
  }
  await database.close();
});

router.post('/', async (req, res) => {
  await database.connect();
  try {
    res.send(await database.save(req.body));
  } catch (err) {
    res.status(400).send(err);
  }
  await database.close();
});

module.exports = router;
