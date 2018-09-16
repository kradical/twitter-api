const User = require('../../src/models/User');

let count = 1;

const userFactory = async (props) => {
  const defaultProps = {
    screenName: `TestScreenName${count}`,
    userName: `TestUserName${count}`,
  };

  count += 1;

  return User.query().insert({
    ...defaultProps,
    ...props,
  });
};

module.exports = userFactory;
