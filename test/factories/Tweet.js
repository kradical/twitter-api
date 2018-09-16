const Tweet = require('../../src/models/Tweet');

const userFactory = require('./User');

let tweetId = 1;

const tweetFactory = async (props = {}) => {
  const defaultProps = {
    createdAt: new Date(),
    favoriteCount: 0,
    isRetweet: false,
    retweetCount: 0,
    text: 'Test Tweet',
    tweetId,
  };

  tweetId += 1;

  if (!props.userId) {
    const user = await userFactory();
    defaultProps.userId = user.id;
  }

  return Tweet.query().insert({
    ...defaultProps,
    ...props,
  });
};

module.exports = tweetFactory;
