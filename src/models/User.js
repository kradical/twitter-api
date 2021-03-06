const { Model } = require('objection');

const { BaseModel } = require('./BaseModel');

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'screenName',
        'userName',
      ],

      properties: {
        id: { type: 'integer' },
        screenName: { type: 'string', minLength: 1, maxLength: 255 },
        userName: { type: 'string', maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const Tweet = require('./Tweet');

    return {
      tweets: {
        relation: Model.HasManyRelation,
        modelClass: Tweet,
        join: {
          from: 'users.id',
          to: 'tweets.userId',
        },
      },
    };
  }
}

module.exports = User;
