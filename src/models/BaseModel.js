const { Model } = require('objection');
const { DbErrors } = require('objection-db-errors');

class BaseModel extends DbErrors(Model) { }

module.exports = {
  BaseModel,
};
