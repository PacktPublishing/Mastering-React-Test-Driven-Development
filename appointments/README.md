# Appointments

This is the example application for the book _Mastering Test-Driven Development for React_.

Your source code should go in the `src` directory and your tests in `test`.

The repository also includes a server implementation which isn't covered in the book, but required to run the examples. Both the tests and production code for the server is located within `server`, and you shouldn't need to modify it unless you're curious.

# Prerequisities

You'll need to have [Node](http://nodejs.org), including NPM, installed on your machine.

*Important*: Run `npm install` before attempting any of the instructions below.

You may also wish to run `npm upgrade` to ensure your Node installation is up-to-date.

# Running tests

Use the following command to run all tests.

    npm test

Here's an example of running tests in a single file:

    npm test test/AppointmentsDayView.test.js

# Building and running the application

Build the application using this command:

    npm run build

Once you've done that you can start the server with the following command.

    PORT=8000 npm run serve

Providing `PORT` is optional. The default port is 3000, although you should feel free to change this if it's easier for you--it's listed in `src/server.js`.

# Running server tests

If you're curious about how the server operates, can run run server tests using the following command.

    npm run test-server
