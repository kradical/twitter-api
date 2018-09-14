Challenge: A small web service
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

## Setup
1. Ensure you have a postgres database running with a user setup with your local username.
2. `$ npm run db:create`
3. `$ npm run db:schema`
4. `$ npm run db:import`
5. `$ npm start`

The server will now be listening on port x.

## Design Decisions

I decided to batch process the input. This is because fanning out to insert everything at once causes an out of memory error, and trying to collect everything for a bulk insert was causing issues with the query builder. I also made sure to keep the latest user name for each user because those can change over time.
