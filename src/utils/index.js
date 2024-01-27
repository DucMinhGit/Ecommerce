'use strict'

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefineObject = object => {
  Object.keys(object).forEach(key => {
    if(object[key] === null || object[key] === undefined) {
      delete object[key];
    }
  });

  return object;
}

const updateNestedObjectParser = objects => {
  const final = {};

  Object.keys(objects || {}).forEach(key => {
    if (typeof objects[key] === 'object' && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(objects[key]);

      Object.keys(response || {}).forEach(a => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = objects[key];
    }
  });

  return final;
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefineObject,
  updateNestedObjectParser
}