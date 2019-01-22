# Spec Logo

This is a simple Logo interpreter, written with a strict TDD approach.

# Prerequisites

You'll need to have [Node](http://nodejs.org), including NPM, installed on your machine.

*Important*: Run `npm install` before attempting any of the instructions below.

You may also wish to run `npm upgrade` to ensure your Node installation is up-to-date.

# Running tests

Use the following command to run all tests.

    npm test

Here's an example of running tests in a single file:

    npx jest test/App.test.js

# Building and running the application

Build the application using this command:

    npm run build

Once you've done that you can start the server with the following command.

    PORT=8000 npm run serve

Then you can navigate to http://localhost:8000/ to view the app.

Providing `PORT` is optional. The default port is 3000, although you should feel free to change this if it's easier for you--it's listed in `src/server.js`.

# Running server tests

If you're curious about how the server operates, can run run server tests using the following command.

    npm run test-server

# Running Cucumber acceptance tests

    npm run cucumber
