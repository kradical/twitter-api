const { Model } = require('objection');

const { BaseModel } = require('./BaseModel');

class Tweet extends BaseModel {
  static get tableName() {
    return 'tweets';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'createdAt',
        'favoriteCount',
        'tweetId',
        'isRetweet',
        'retweetCount',
        'text',
        'userId',
      ],

      properties: {
        createdAt: { type: 'dateTime' },
        favoriteCount: { type: 'integer' },
        id: { type: 'integer' },
        isRetweet: { type: 'boolean' },
        retweetCount: { type: 'integer' },
        text: { type: 'string', minLength: 1, maxLength: 255 },
        tweetId: { type: 'bigInteger' },
        userId: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const User = require('./User');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tweets.userId',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Tweet;
