# Day 5-7 - March 10-12th:

### Change to `GET /api/v2/feed/account/{accountUid}/category/{categoryUid}/transactions-between`

- Updated the transaction feed store to use the transactions-between endpoint so that the user could see transactions between a min and max date (eg. relative 1-week)
- Added a date-time picker so the user could pick their date range

  - The date range defaults to the past 7 days on first load
  - Every time the user selects a new date range, `GET /api/v2/feed/account/{accountUid}/category/{categoryUid}/transactions-between` is called again.

- Had issues with `$fetch`/`ofetch` not passing through the min and max date strings in the query params
  - I found that `ofetch` uses another package `h3` to handle query and request bodies, so I had to update my proxy server to use the [`getQuery` function](https://www.jsdocs.io/package/h3#getQuery) instead of trying to manually get it from the request URL
  - This lead to issues with my [test for the proxy server](../tests/[...endpoint].test.js), as I couldnt' figure out how to mock `getQuery` properly, so the 2 tests where I try to pass in a query now fail. I tried to debug this for a while but moved on for the sake of getting the rest of the requirements done.
  - Again, if I were to redo this project, I would prefer to use native `fetch` on all my client and serverside requests for more control and clearer debugging

<hr>

### Scaffold the Savings Spaces Pages -- See all Spaces & Create a new Space

- Added the [Savings Goal store](../store/savingsGoals.ts), which calls the below endpoints:

  - `GET /api/v2/account/{accountUid}/savings-goals`
  - `PUT /api/v2/account/{accountUid}/savings-goals`
  - `PUT /api/v2/account/{accountUid}/savings-goals/{savingsGoalUid}/add-money/{transferUid}`

- Created the page for See all Spaces

  - `GET /api/v2/account/{accountUid}/savings-goals` worked as expected
    <br>

   <img src="./images/Savings Spaces.png"/>
  <br>

- Create the page for Create a new Space

  - When trying `PUT /api/v2/account/{accountUid}/savings-goals`, I encountered issues with sending the request body, again because `h3` has a function for [`readBody`](https://www.jsdocs.io/package/h3#readBody)
  - Once I added this method to my proxy server, I now had issues with the previously working GET requests being rejected by the proxy server not being able to access my token, even though it was being passed from the frontend as usual.
  - After reading the docs on [h3 Body utils](https://h3.unjs.io/utils/request#body-utils), it seems that using `readBody` on `GET` requests causes some sort of security risk for [CSRF](https://owasp.org/www-community/attacks/csrf) attacks, so I added a check on [`line 34`](../server/api/starling/[...endpoint].js) to NOT parse the body on `GET` requests, and this seemed to fix the issue.
  - Again, if I were to redo this project, I would prefer to use native `fetch` on all my client and serverside requests for more control and clearer debugging

  - For the user flow of Create a Space, if the creation is successful, the user will see a success notification and be re-directed to the See All Spaces page.

<img src="./images/Create a space.png"/>
<br>

- Created a widget for Roundups on the See All Spaces page
  - User can see all roundups
  - When user clicks on the "apply roundup" button, they will see all available spaces
  - When user clicks on the space, the roundup is applied.
  - User will see the available spaces have a white overlay with a spinner while the transaction is being applied.
  - User will see a success notification if successful, and the app will re-fetch the users's `balance`, `transaction feed` and `savings spaces`

<br>

<img src="./images/Transaction Feed WIP 2.png"/>

<br>

<hr>

### Final Tests and UI Cleanup

- Added final unit tests & cleaned up codebase/UI
- Added images to the transaction feed items and savings spaces
  - Originally I used the `counterPartyUUID`, but for some reason many "Mickey Mouse" transactions had different `counterPartyUUID`.
  - For this reason, I switched to the `counterPartyName` instead to keep them unique for the sake of time.

<img src="./images/Transaction Feed.png"/>
<img src="./images/Apply Roundup.png"/>
