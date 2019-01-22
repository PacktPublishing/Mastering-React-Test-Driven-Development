import { Given, When, Then, Before, After } from 'cucumber';

Before(function() {
  this.startServer();
});

After(function() {
  this.closeServer();
});
