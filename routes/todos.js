const express = require('express');
const router = express.Router();
const todos = require('../database/todorepository.js');

const createTodoObjectFromRequest = (req) => {
  const todo = {
    date_created: req.body.date_created,
    date_deadline: req.body.date_deadline,
    name: req.body.name,
    description: req.body.description,
    is_done: false,
    priority: +req.body.priority,
    listid: +req.body.listid,
  };

  return todo;
};

// GET ALL OR ONE
const getTodos = async (req, res, next) => {
  try {
    const context = {};

    if (req.params.id) {
      context.id = +req.params.id;
    } else {
      context.offset = +req.query.offset;
      context.limit = +req.query.limit;
    }

    const result = await todos.find(context);

    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      const payload = {
        msg: context.id
          ? `No entry found with id: ${context.id}`
          : `No entries found.`,
        content: { ...context },
        data: result,
      };

      res.status(404).send(payload);
    }
  } catch (e) {
    next(e);
  }
};

// POST
const post = async (req, res, next) => {
  try {
    const todo = createTodoObjectFromRequest(req);
    todo.date_created = new Date();
    const result = await todos.save(todo);
    const payload = {
      msg: 'Added to database successfully.',
      content: { id: result.insertId, ...todo },
      data: result,
    };
    res.status(201).send(payload);
  } catch (e) {
    next(e);
  }
};

// PUT (UPDATE)
const updateTodo = async (req, res, next) => {
  try {
    let todo = createTodoObjectFromRequest(req);
    todo.id = +req.params.id;
    todo = await todos.update(todo);

    if (todo !== null) {
      res.status(200).send(todo);
    } else {
      res.status(404).end('Content not found');
    }
  } catch (e) {
    next(e);
  }
};

// DELETE
// const deleteTodo = async (req, res, next) => {
//   try {
//     const id = +req.params.id;
//     const result = await todos.deleteById(id);

//     if (result) {
//       res.status(204).end();
//     } else {
//       res.status(404).end('Content not found.');
//     }
//   } catch (e) {
//     next(e);
//   }
// };

const deleteTodo = async (req, res, next) => {
  try {
    const context = {};
    context.id = +req.params.id;
    const result = await todos.deleteById(context);
    if (result.affectedRows === 0) {
      const payload = {
        msg: `No entry found with id: ${context.id}`,
        content: { ...context },
        data: result,
      };
      res.status(404).send(payload);
    } else {
      res.status(204).end();
    }
  } catch (e) {
    next(e);
  }
};

router
  .route('/todos/:id([1-9]*)?')
  .get(getTodos)
  .post(post)
  .put(updateTodo)
  .delete(deleteTodo);

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
