Feature: Drawing

  A user can draw shapes by entering commands at the prompt.

  Scenario: Drawing functions
    Given the user navigated to the application page
    When the user enters the following instructions at the prompt:
      | to drawsquare |
      |   repeat 4 [ forward 10 right 90 ] |
      | end |
      | drawsquare |
    Then these lines should have been drawn:
      | x1 | y1 | x2 | y2 |
      | 0  | 0  | 10 | 0  |
      | 10 | 0  | 10 | 10 |
      | 10 | 10 | 0  | 10 |
      | 0  | 10 | 0  | 0  |
