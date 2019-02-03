import { Given, When, Then } from 'cucumber';
import { checkLinesFromDataTable } from './svg';
import {
  calculateTurtleXYFromPoints,
  calculateTurtleAngleFromTransform
} from './turtle';
import expect from 'expect';

Given(
  'the presenter navigated to the application page',
  async function() {
    await this.browseToPageFor('presenter', this.appPage());
  }
);

Given('the presenter clicked the button {string}', async function(
  buttonId
) {
  await this.getPage('presenter').waitForSelector(
    `button#${buttonId}`
  );
  await this.getPage('presenter').click(`button#${buttonId}`);
});

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

When(
  'the observer waits for animations to finish',
  async function() {
    await this.waitForAnimationToBegin('observer');
    await this.waitForAnimationToEnd('observer');
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

When(
  'the presenter entered the following instructions at the prompt:',
  async function(dataTable) {
    for (let instruction of dataTable.raw()) {
      await this.getPage('presenter').type(
        'textarea',
        `${instruction}\n`
      );
      await this.waitForAnimationToEnd('presenter');
    }
  }
);

When('the presenter clicks the button {string}', async function(
  buttonId
) {
  await this.getPage('presenter').waitForSelector(
    `button#${buttonId}`
  );
  await this.getPage('presenter').click(`button#${buttonId}`);
});

Then('the observer should see no lines', async function() {
  const numLines = await this.getPage('observer').$$eval(
    'line',
    lines => lines.length
  );
  expect(numLines).toEqual(0);
});

Then('the presenter should see no lines', async function() {
  const numLines = await this.getPage('presenter').$$eval(
    'line',
    lines => lines.length
  );
  expect(numLines).toEqual(0);
});

Then(
  'the observer should see the turtle at x = {int}, y = {int}, angle = {int}',
  async function(expectedX, expectedY, expectedAngle) {
    await this.waitForAnimationToEnd('observer');
    const turtle = await this.getPage('observer').$eval(
      'polygon',
      polygon => ({
        points: polygon.getAttribute('points'),
        transform: polygon.getAttribute('transform')
      })
    );
    const position = calculateTurtleXYFromPoints(turtle.points);
    const angle = calculateTurtleAngleFromTransform(
      turtle.transform
    );
    expect(position.x).toBeCloseTo(expectedX);
    expect(position.y).toBeCloseTo(expectedY);
    expect(angle).toBeCloseTo(expectedAngle);
  }
);

Then(
  'the presenter should see the turtle at x = {int}, y = {int}, angle = {int}',
  async function(expectedX, expectedY, expectedAngle) {
    await this.waitForAnimationToEnd('presenter');
    const turtle = await this.getPage('presenter').$eval(
      'polygon',
      polygon => ({
        points: polygon.getAttribute('points'),
        transform: polygon.getAttribute('transform')
      })
    );
    const position = calculateTurtleXYFromPoints(turtle.points);
    const angle = calculateTurtleAngleFromTransform(
      turtle.transform
    );
    expect(position.x).toBeCloseTo(expectedX);
    expect(position.y).toBeCloseTo(expectedY);
    expect(angle).toBeCloseTo(expectedAngle);
  }
);

Then(
  'these lines should have been drawn for the presenter:',
  checkLinesFromDataTable('presenter')
);
Then(
  'these lines should have been drawn for the observer:',
  checkLinesFromDataTable('observer')
);
