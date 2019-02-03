Feature: Sharing

  A user can choose to present their session to any number of other
  users, who observe what the presenter is doing via their own
  browser.

  Scenario: Observer joins a session
    Given the presenter navigated to the application page
    And the presenter clicked the button 'startSharing'
    And the presenter clicks the button 'reset'
    When the observer navigates to the presenter's sharing link
    Then the observer should see a message saying 'You are now watching the session'

  Scenario: Presenter chooses to reset current state when sharing
    Given the presenter navigated to the application page
    And the presenter entered the following instructions at the prompt:
      | forward 10 |
      | right 90 |
    And the presenter clicked the button 'startSharing'
    When the presenter clicks the button 'reset'
    And the observer navigates to the presenter's sharing link
    Then the observer should see no lines
    And the presenter should see no lines
    Then the observer should see the turtle at x = 0, y = 0, angle = 0
    And the presenter should see the turtle at x = 0, y = 0, angle = 0

  Scenario: Presenter chooses to keep and replay state when sharing
    Given the presenter navigated to the application page
    And the presenter entered the following instructions at the prompt:
      | forward 10 |
      | right 90 |
    And the presenter clicked the button 'startSharing'
    When the presenter clicks the button 'keep'
    And the observer navigates to the presenter's sharing link
    And the observer waits for animations to finish
    Then these lines should have been drawn for the observer:
      | x1 | y1 | x2 | y2 |
      | 0  | 0  | 10 | 0  |
    And these lines should have been drawn for the presenter:
      | x1 | y1 | x2 | y2 |
      | 0  | 0  | 10 | 0  |
    And the observer should see the turtle at x = 10, y = 0, angle = 90
    And the presenter should see the turtle at x = 10, y = 0, angle = 90
