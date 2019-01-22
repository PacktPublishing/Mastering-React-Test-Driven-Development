Feature: Sharing

  A user can choose to present their session to any number of other
  users, who observe what the presenter is doing via their own
  browser.

  Scenario: Observer joins a session
    Given the presenter navigated to the application page
    And the presenter clicked the button 'startSharing'
    When the observer navigates to the presenter's sharing link
    Then the observer should see a message saying 'You are now watching the session'
