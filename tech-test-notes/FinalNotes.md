# Final Notes

Overview of Requirements achieved:

### Requirements:

Achieve the below WITHOUT using the existing Round Up endpoints:

#### Main requirements:

- [x] User can log in
  - `GET /api/v2/accounts`
- [x] User can see their transaction feed for a given week
  - `GET /api/v2/feed/account/{accountUid}/category/{categoryUid}/transactions-between`
- [x] User can see a possible roundup of each transaction -- **on OUTGOING transactions that are not INTERNAL_TRANSFERS**
  - **Note:** _I decided at this point to only show/enable rounding up on OUTGOING transactions & transactions which were not INTERNAL_TRANSFERS, as I believe this is the behaviour of the Starling App as a current user_
- [x] User can see their savings spaces
  - `GET /api/v2/account/{accountUid}/savings-goals`
- [x] User can create a savings space
  - `PUT /api/v2/account/{accountUid}/savings-goals`
- [x] User can select a savings space to transfer their roundup into & see the roundup being applied
  - `PUT /api/v2/account/{accountUid}/savings-goals/{savingsGoalUid}/add-money/{transferUid}`

#### Nice to have:

- [x] Site is deployed live
- [x] UI looks like Starling's site & takes as many components/designs from the site as possible
  - [x] User can see their balance on the transaction feed page
  - [x] User can see their name
  - [x] Login page looks like Starling login page UI
  - [x] Authenticated pages look like Starling's authenticated pages UI (eg. navbar)
  - [x] Transaction feed looks like Starling's transaction feed
  - [x] Savings spaces look like Starling's transaction feed
- [ ] User can select/deselect individual transactions to apply to the roundup total
- [ ] User can see when a transaction already has a roundup applied
- [ ] User cannot apply roundup on previously applied transactions
- [ ] User can filter by transaction category and transaction direction
- [ ] User can see some sort of animation when the roundup transaction is applied to encourage saving

<hr>

I wasn't able to implement all the features I wanted, but I think this implements all the requirements on the tech test instructions. <br>
In my usual workflow, I would create a working MVP that is refined as possible within a timeframe and send to users for early feedback at this point. <br>
I found the project very fun, and I will be working on implementing the remaining features on a branch separate from main while the tech test is being reviewed. <br>

For `User can see when a transaction already has a roundup applied` and `User cannot apply roundup on previously applied transactions`, I was thinking to do a hacky workaround, where I would call the endpoint to add a user note to each transaction that a roundup was successfully applied with

```
eg.
item.userNote = "{goalCategoryUid: XXXXX, amount: {currency: 'GBP', minorUnits: 123456}}" -- I would stringify a JSON object equivalent to the AssociatedRoundUp schema
```

- Given we are not meant to use the existing roundup endpoint, I thought this would be a workaround equivalent to the official implementation where the transaction feed item would have a `roundUp` property.
