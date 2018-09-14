const fs = require('fs');
const readline = require('readline');
const { performance } = require('perf_hooks');

const JSONbig = require('json-bigint');
const { UniqueViolationError } = require('objection-db-errors');

// bind knex
require('../../src/app');
const User = require('../../src/models/User');
const Tweet = require('../../src/models/Tweet');

const DATA_SOURCE = 'fixtures/chelsea_twitter.json';
const input = fs.createReadStream(DATA_SOURCE);
const lineReader = readline.createInterface({ input });

const BATCH_SIZE = 5000;
let batchCount = 0;

const userMap = new Map();
let tweetBuffer = [];
let createEntitiesPromise;

const start = performance.now();

const logTime = () => {
  const now = performance.now();
  // eslint-disable-next-line no-console
  console.log(`${(now - start) / 1000} seconds elapsed`);
};

const updateUserMap = (tweet) => {
  const userRecord = {
    record: {
      screenName: tweet.screen_name,
      userName: tweet.user_name,
    },
    meta: {
      createdAt: tweet.created_at,
    },
  };


  if (userMap.has(tweet.screen_name)) {
    const timestamp = userMap.get(tweet.screen_name).meta.createdAt;

    if (timestamp < tweet.created_at) {
      userMap.set(tweet.screen_name, userRecord);
    }
  } else {
    userMap.set(tweet.screen_name, userRecord);
  }
};

const updateTweetBuffer = (tweet) => {
  const tweetRecord = {
    record: {
      createdAt: tweet.created_at,
      favoriteCount: tweet.favorite_count,
      isRetweet: tweet.is_retweet,
      retweetCount: tweet.retweet_count,
      text: tweet.text,
      tweetId: tweet.tweet_id.toString(),
    },
    meta: {
      userScreenName: tweet.screen_name,
    },
  };

  tweetBuffer.push(tweetRecord);
};

const findOrCreateUser = async (record) => {
  // first check to see if we have cached the id yet.
  const cached = userMap.get(record.screenName);

  if (cached && cached.id) {
    return cached;
  }

  // then do a proper find-create-find
  let fetched = await User.query().findOne({ screenName: record.screenName });

  if (!fetched) {
    try {
      fetched = await User.query().insert(record);

      // store the id in the local cache.
      cached.id = fetched.id;
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        fetched = await User.query().findOne({ screenName: record.screenName });
      }
    }
  }

  return fetched;
};

const createEntities = async () => {
  const tweetRecords = await Promise.all(
    tweetBuffer.map(async (t) => {
      const user = userMap.get(t.meta.userScreenName);

      const result = await findOrCreateUser(user.record);

      return {
        ...t.record,
        userId: result.id,
      };
    }),
  );

  return Tweet.query().insert(tweetRecords);
};

const handleStreamPause = async () => {
  // eslint-disable-next-line no-console
  console.log(`Processing batch ${batchCount}`);
  batchCount += 1;

  createEntitiesPromise = createEntities();
  await createEntitiesPromise;

  tweetBuffer = [];
  input.resume();
};

const handleStreamClose = async () => {
  await createEntitiesPromise;

  logTime();

  process.exit(0);
};

const handleLine = (line) => {
  const tweet = JSONbig.parse(line);

  updateUserMap(tweet);
  updateTweetBuffer(tweet);

  if (tweetBuffer.length >= BATCH_SIZE) {
    input.pause();
  }
};

lineReader.on('line', handleLine);
input.on('pause', handleStreamPause);
input.on('close', handleStreamClose);
