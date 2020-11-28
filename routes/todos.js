const express = require('express');
const router = express.Router();
const todos = require('../database/todorepository.js');

const createTodoObjectFromRequest = (req) => {
  // This works a bit better, now the db can handle
  // defaults properly.
  const template = [
    'date_created',
    'date_deadline',
    'name',
    'description',
    'is_done',
    'priority',
    'listid',
  ];
  const todo = {};
  for (const element of template) {
    if (element in req.body) {
      todo[element] = req.body[element];
    }
  }
  // console.log(todo);
  return todo;
};

// GET ALL OR ONE
const get = async (req, res, next) => {
  try {
    const context = {};
    if (req.params.id) {
      context.id = +req.params.id;
    } else {
      // For filtering purposes
      if (req.query.listid) {
        context.listid = req.query.listid;
      }
      if (req.query.is_done) {
        context.is_done = req.query.is_done;
      }
      if (req.query.priority) {
        context.priority = req.query.priority;
      }

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
    const context = createTodoObjectFromRequest(req);
    context.date_created = new Date();
    const result = await todos.save(context);
    const payload = {};
    let status;
    if (result.insertId) {
      payload.msg = 'Added to database successfully';
      payload.content = { id: result.insertId, ...context };
      payload.data = result;
      status = 201;
    } else {
      payload.msg = 'Validation errors. Could not add to database.';
      payload.content = { ...context };
      payload.error = result;
      status = 400;
    }
    res.status(status).send(payload);
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
