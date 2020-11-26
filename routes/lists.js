const express = require('express');
const router = express.Router();
const lists = require('../database/listrepository');

const get = async (req, res, next) => {
  try {
    let result;
    if (req.params.id) {
      const id = +req.params.id;
      result = await lists.findById(id);
      res.status(200).send(result);
    } else {
      const offset = +req.query.offset;
      const limit = +req.query.limit;
      result = await lists.findAll({ offset, limit });
      res.status(200).send(result);
    }
  } catch (e) {
    res.status(404).end('Content not found.');
    next(e);
  }
};

router.route('/lists/:id([1-9]*)?').get(get);

module.exports = router;
