import { Given, When, Then } from 'cucumber';
import expect from 'expect';
import { checkLinesFromDataTable } from './svg';

Given(
  'the user navigated to the application page',
  async function() {
    await this.browseToPageFor('user', this.appPage());
  }
);

When(
  'the user enters the following instructions at the prompt:',
  async function(dataTable) {
    for (let instruction of dataTable.raw()) {
      await this.getPage('user').type(
        'textarea',
        `${instruction}\n`
      );
      await this.waitForAnimationToEnd('user');
    }
  }
);

Then(
  'these lines should have been drawn:',
  checkLinesFromDataTable('user')
);
