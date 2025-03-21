# Day 3-4 - March 8th-9th:

### Install Vitest & Unit testing & Big refactor

- Add vitest for unit testing -- opted for this due to familiarity

- Went back to existing components and added unit tests for the behaviour/refactored for isolation of responsibilities
- I did a lot of refactoring at this point to make sure everything was secure and easy to maintain, as my original scaffolding was quick and dirty.

- The above is generally my working pattern:

  - Make skeleton of feature based on mental list of requirements
  - Refactor into componenents
  - Add unit tests for components & refactor for isolation of responsibilities
  - PR/deploy

- For the refactor, I started a pattern of creating types associated with each store/endpoint based on the Starling API docs
- Below each type is a helper function to generate a random instance of that type using the [faker api](https://fakerjs.dev/)

#### Starling API Related Stores:

|                  | **Store**                                                                      | **Type**                              |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| Account          | [Store](../store/accounts.ts), [Test](../store/accounts.test.ts)               | [type](../types/account.type.ts)      |
| User ID          | [Store](../store/userIdentity.ts), [Test](../store/userIdentity.test.ts)       | [type](../types/userIdentity.type.ts) |
| Balance          | [Store](../store/balance.ts), [Test](../store/balance.test.ts)                 | [type](../types/balance.type.ts)      |
| Transaction Feed | [Store](../store/transactionFeed.ts), [Test](../store/transactionFeed.test.ts) | [type](../types/feedItem.type.ts)     |
| Savings Goal     | [Store](../store/savingsGoals.ts), [Test](../store/savingsGoals.test.ts)       | [type](../types/savingsGoal.type.ts)  |

<hr>

### Research Styling for Authenticated Pages & Setup Authenticated Layout

- Did visual research on the layout components for the authenticated pages on my own Starling person account (details redacted for privacy)
  <img src="./images/Transaction Feed Page Research.png"/>
  <img src="./images/Savings Space Research.png"/>

- Created an [Authenticated Layout](../layouts/authenticated.vue), containing some navbar components that showed the user's full name, account type, and some links

- Originally tried transaction feed without query params with `GET /api/v2/feed/account/${accountUid}/category/{categoryUid}` -- this worked as expected
- [Transaction Feed Store](../store/transactionFeed.ts), [tests](../store/transactionFeed.test.ts), []

- Rough styling on transaction feed items
