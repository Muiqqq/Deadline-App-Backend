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
const get = async (req, res, next) => {
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
// NOTE: Figure out if edit warrants date_created change...
const put = async (req, res, next) => {
  try {
    const context = {};
    context.id = +req.params.id;
    context.todo = createTodoObjectFromRequest(req);
    context.todo.date_created = new Date();
    const result = await todos.update(context);

    const payload = {
      msg: '',
      content: { ...context },
      data: result,
    };

    if (result.affectedRows === 0) {
      payload.msg = `No entry found with id: ${context.id}`;
      res.status(404).send(payload);
    } else {
      payload.msg = `Entry with id: ${context.id} updated successfully.`;
      res.status(200).send(payload);
    }
  } catch (e) {
    next(e);
  }
};

// DELETE
const del = async (req, res, next) => {
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

router.route('/todos/:id([1-9]*)?').get(get).post(post).put(put).delete(del);

module.exports = router;
