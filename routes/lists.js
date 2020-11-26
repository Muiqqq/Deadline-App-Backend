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
      res
        .status(404)
        .send(
          context.id
            ? `No entry found with id: ${context.id}`
            : `No entries found.`
        );
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

router.route('/lists/:id([1-9]*)?').get(get).post(post);

module.exports = router;
