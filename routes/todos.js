const express = require('express');
const router = express.Router();
const database = require('../database/crudrepository.js');

const getTodos = async (req, res, next) => {
  try {
    let result;
    if (req.params.id) {
      const id = +req.params.id;
      result = await database.findById(id);
      res.status(200).send(result);
    } else {
      result = await database.findAll();
      res.status(200).send(result);
    }
  } catch (e) {
    res.status(404).end('Content not found.');
    next(e);
  }
};

router.route('/todos/:id([1-9]*)?').get(getTodos);

// // GET ALL
// router.get('/', async (req, res) => {
//   try {
//     res.send(await database.findAll());
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // POST
// router.post('/', async (req, res) => {
//   try {
//     res.send(await database.save(req.body));
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // DELETE
// router.delete('/:urlId([1-9]*)', async (req, res) => {
//   const urlId = Number(req.params.urlId);
//   try {
//     res.send(await database.deleteById(urlId));
//   } catch (err) {
//     res.status(404).json({ msg: `No todo with the id of ${urlId}` });
//   }
// });

// // GET id
// router.get('/:urlId([1-9]*)', async (req, res) => {
//   const urlId = Number(req.params.urlId);
//   try {
//     res.send(await database.findById(urlId));
//   } catch (err) {
//     res.status(404).json({ msg: `No todo with the id of ${urlId}` });
//   }
// });

module.exports = router;
