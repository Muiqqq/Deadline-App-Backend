const express = require('express');
const router = express.Router();
const lists = require('../database/listrepository');
const todos = require('../database/todorepository');

// Get apikey from a local .env file if not running
// through heroku
if (!process.env.APIKEY) {
  require('dotenv').config();
}

const apikey = process.env.APIKEY;
const invalidApiKeyMsg = 'Please provide valid api key.';

// GET
const get = async (req, res, next) => {
  try {
    if (req.query.apikey === apikey) {
      const context = {};

      if (req.params.id) {
        context.id = +req.params.id;
      } else {
        context.offset = +req.query.offset;
        context.limit = +req.query.limit;
        context.sort = req.query.sort;
      }

      let result;
      // /api/lists/1?q=todos
      // Returns an object with both the list's info
      // and all the todos that belong to that list.
      // Todos could already be filtered by listid, but
      // this way only one api request is needed to get
      // both the list and the todos that point to it.
      if (req.query.q === 'todos' && context.id) {
        const todoContext = {};
        todoContext.listid = context.id;
        todoContext.offset = +req.query.offset;
        todoContext.limit = +req.query.limit;
        todoContext.sort = req.query.sort;
        result = { list: {}, todos: [] };
        result.list = await lists.find(context);
        result.todos = await todos.find(todoContext);
      } else {
        result = await lists.find(context);
      }

      const resultArray = req.query.q ? result.todos : result;
      if (resultArray.length > 0) {
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
    } else {
      res.status(400).send(invalidApiKeyMsg);
    }
  } catch (e) {
    next(e);
  }
};

// POST
const post = async (req, res, next) => {
  try {
    if (req.query.apikey === apikey) {
      const context = {};
      context.name = req.body.name;
      const result = await lists.save(context);
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
    } else {
      res.status(400).send(invalidApiKeyMsg);
    }
  } catch (e) {
    next(e);
  }
};

// DELETE
const del = async (req, res, next) => {
  try {
    if (req.query.apikey === apikey) {
      const context = {};
      context.id = +req.params.id;
      const result = await lists.deleteById(context);
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
    } else {
      res.status(400).send(invalidApiKeyMsg);
    }
  } catch (e) {
    next(e);
  }
};

// PUT
const put = async (req, res, next) => {
  try {
    if (req.query.apikey === apikey) {
      const context = {};
      context.id = +req.params.id;
      context.name = req.body.name;
      const result = await lists.update(context);

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
    } else {
      res.status(400).send(invalidApiKeyMsg);
    }
  } catch (e) {
    next(e);
  }
};

router.route('/lists/:id([1-9]*)?').post(post).get(get).put(put).delete(del);

module.exports = router;
