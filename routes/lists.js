const express = require('express');
const router = express.Router();
const lists = require('../database/listrepository');

const get = async (req, res, next) => {
  try {
    const context = {};

    if (req.params.id) {
      context.id = +req.params.id;
    } else {
      context.offset = +req.query.offset;
      context.limit = +req.query.limit;
    }

    const result = await lists.find(context);

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

const post = async (req, res, next) => {
  try {
    const context = {};
    context.name = req.body.name;
    const result = await lists.save(context);
    const payload = {
      msg: 'Added to database successfully.',
      content: { id: result.insertId, ...context },
      data: result,
    };
    res.status(201).send(payload);
  } catch (e) {
    next(e);
  }
};

const del = async (req, res, next) => {
  try {
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
  } catch (e) {
    next(e);
  }
};

const put = async (req, res, next) => {
  try {
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
  } catch (e) {
    next(e);
  }
};

router.route('/lists/:id([1-9]*)?').post(post).get(get).put(put).delete(del);

module.exports = router;
