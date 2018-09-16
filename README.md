## Setup
1. Ensure you have a postgres database running with a user setup with your local username.
2. `$ npm run db:create`
3. `$ npm run db:migrate`
4. `$ npm run db:import`
5. `$ npm start`

The server will now be listening on port 3000.

`$ npm test` will run the tests.

## Design Decisions

I separated the data into two logical models, Users and Tweets. I used internal ids as primary keys because relying on external attributes being uniquely identifiable is spotty at best.

To import the data I decided to batch process the file. This is because a simple fan out to insert each tweet / user caused an out of memory error, and trying to collect everything for a bulk insert was causing issues with the query builder. I also made sure to keep the latest user name for each user because those can change over time. After quickly referencing twitter's API I decided to identify users uniquely by screen name. I held all the users in memory to ensure each user got created with their latest userName/displayName. If they didn't fit I would have needed a more creative solution, maybe creating a temporary db table to hold and then sort and then create the real users.

One thing I noticed while importing was that I was getting duplicate tweet_id's which led me to realize that the tweet_id's are big integers. So I used a custom drop in replacement for JSON.parse and changed the column types in the database.

I chose to use postgres because I am familiar with it and it has a fairly powerful document based text search feature. I used objection.js as an ORM because I haven't used it before and wanted to try it out. It is built on top of the knex query building library which allows you to drop down to a robust, powerful query builder very easily when needed. I chose to use express for routing / req/res lifecycle handling because it is so wildly popular, easy to use, and quick to get up and running.

I also wrote some integration tests using mocha/chai/chai-http. These spin up the server inside the test and then hit it with requests and assert against the responses.

## API Documentation

The routes are as follows:
* `GET /tweets/:id`: Gets a specific tweet by `tweet_id`
* `GET /tweets`: Filterable route to get all tweets
* `GET /users/:name`: Gets a specific user by `screen_name`
* `GET /users/:name/tweets`: Filterable route to get a user's tweets

`GET /tweets` and `GET /users/:name/tweets` can both be filtered by query parameters:
* `query`: finds tweets with matching text
* `after`: finds tweets created after this date
* `before`: finds tweets created before this date
* `retweets`: finds tweets with more retweets than this number

These query parameters are all optional and can be mixed arbitrarily.

These two routes can also control pagination with optional query parameters:
* `page`: fetches a specific db page
* `limit`: chooses page size, max of 1000

Side note: tweet queries are ordered by createdAt because somewhat deterministic pagination is great.

examples:

GET `localhost:3000/users/testuser/tweets?query=test&after=2000-01-01T00:00:00.000Z&before=2100-01-01T00:00:00.000Z&retweets=0&page=2&limit=5`

Will get tweets with screenName `testuser`, matching text `test`, in the date range January 1st, 2000 - January 1st, 2100, with more than 0 retweets (exlusive). It will retrieve page 2 and limit to returning 5 tweets.

GET `localhost:3000/tweets?query=test&after=2000-01-01T00:00:00.000Z&before=2100-01-01T00:00:00.000Z&retweets=0&page=2&limit=5`

Will get tweets matching text `test`, in the date range January 1st, 2000 - January 1st, 2100, with more than 0 retweets (exlusive). It will retrieve page 2 and limit to returning 5 tweets.

Paginated endpoints will also return pagination info in the response headers:
* `Total-Count`: The total number of entities
* `Link`: Machine-readable links to the first, previous, current, next and last pages

I have added an insomnia export (`Insomnia_Export_2018-09-15.json`) to the project if you want to test it with the insomnia REST client.

## Challenge: 
### A small web service
Attached to this file is a small dataset for twitter tweets.

Can you migrate the data into a database and create API endpoints for the following:

1. Find all tweets that match a given string.
2. Find all tweets by a given user name
3. Find all tweets between the given date/time
5. Find all tweets with more than x retweet counts
6. Find a tweet by tweet id
4. Find a user by user name

Requirements:
- Include migration script for populating the database
- Query results must support pagination
- Responses should be in JSON
- Using a JavaScript stack
- Please use comments to explain any specific design decisions
