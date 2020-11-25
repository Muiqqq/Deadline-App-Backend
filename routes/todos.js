const express = require('express');
const router = express.Router();
const database = require('../database/crudrepository.js');

const createTodoObjectFromRequest = (req) => {
  const todo = {
    date_created: req.body.date_created,
    date_deadline: req.body.date_deadline,
    name: req.body.name,
    description: req.body.description,
    is_done: +req.body.is_done,
    priority: +req.body.priority,
    listid: +req.body.listid,
  };

  return todo;
};

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

const addTodo = async (req, res, next) => {
  try {
    let todo = {
      date_created: new Date(),
      date_deadline: req.body.date_deadline,
      name: req.body.name,
      description: req.body.description,
      priority: +req.body.priority,
      listid: +req.body.listid,
    };

    todo = await database.save(todo);
    res.status(201).send(todo);
  } catch (e) {
    res.status(400).send(e);
    next(e);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    let todo = createTodoObjectFromRequest(req);
    todo.id = +req.params.id;
    todo = await database.update(todo);

    if (todo !== null) {
      res.status(200).send(todo);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
};

router.route('/todos/:id([1-9]*)?').get(getTodos).post(addTodo).put(updateTodo);

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
