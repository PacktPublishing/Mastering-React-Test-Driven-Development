import { Given, When, Then } from 'cucumber';
import expect from 'expect';

Given(
  'the presenter navigated to the application page',
  async function() {
    await this.browseToPageFor('presenter', this.appPage());
  }
);

Given('the presenter clicked the button {string}',
  async function(buttonId) {
    await this.getPage('presenter').click(`button#${buttonId}`);
  }
);

When(
  "the observer navigates to the presenter's sharing link",
  async function() {
    await this.getPage('presenter').waitForSelector('a');
    const link = await this.getPage('presenter').$eval('a', a =>
      a.getAttribute('href')
    );
    const url = new URL(link);
    await this.browseToPageFor('observer', url);
  }
);

Then(
  'the observer should see a message saying {string}',
  async function(message) {
    const pageText = await this.getPage('observer').$eval(
      'body',
      e => e.outerHTML
    );
    expect(pageText).toContain(message);
  }
);
