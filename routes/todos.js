const express = require('express');
const router = express.Router();
const database = require('../database/crudrepository.js');

// GET ALL
router.get('/', async (req, res) => {
  try {
    res.send(await database.findAll());
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    res.send(await database.save(req.body));
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE
// This regex needs to be fixed. Doesn't accept: 10.
router.delete('/:urlId([1-9]*)', async (req, res) => {
  const urlId = Number(req.params.urlId);
  try {
    res.send(await database.deleteById(urlId));
  } catch (err) {
    res.status(404).json({ msg: `No todo with the id of ${urlId}` });
  }
});

// GET id
router.get('/:urlId([1-9]*)', async (req, res) => {
  const urlId = Number(req.params.urlId);
  try {
    res.send(await database.findById(urlId));
  } catch (err) {
    res.status(404).json({ msg: `No todo with the id of ${urlId}` });
  }
});

module.exports = router;
