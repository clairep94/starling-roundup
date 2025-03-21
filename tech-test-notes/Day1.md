# Day 1 - March 6th:

- Made list of requirements based on the tech test instructions & things I personally wanted to try/achieve.
- Annotated possible the Starling APIs endpoints required based on the tech test instructions:

### Requirements:

Achieve the below WITHOUT using the existing Round Up endpoints:

#### Main requirements:

- [ ] User can log in
  - `GET /api/v2/accounts`
  - `GET /api/v2/token`
  - `GET /api/v2/identity/individual`
- [ ] User can see their transaction feed for a given week
  - `GET /api/v2/feed/account/{accountUid}/category/{categoryUid}/transactions-between`
  - `GET /api/v2/feed/account/${accountUid}/category/{categoryUid}`
- [ ] User can see a possible roundup of each transaction -- **on OUTGOING transactions that are not INTERNAL_TRANSFERS**
  - **Note:** _I decided at this point to only show/enable rounding up on OUTGOING transactions & transactions which were not INTERNAL_TRANSFERS, as I believe this is the behaviour of the Starling App as a current user_
- [ ] User can see their savings spaces
  - `GET /api/v2/account/{accountUid}/savings-goals`
- [ ] User can create a savings space
  - `PUT /api/v2/account/{accountUid}/savings-goals`
- [ ] User can select a savings space to transfer their roundup into & see the roundup being applied
  - `PUT /api/v2/account/{accountUid}/savings-goals/{savingsGoalUid}/add-money/{transferUid}`

#### Nice to have:

- [ ] Site is deployed live
- [ ] UI looks like Starling's site & takes as many components/designs from the site as possible
  - [ ] User can see their balance on the transaction feed page
  - [ ] User can see their name
  - [ ] Login page looks like Starling login page UI
  - [ ] Authenticated pages look like Starling's authenticated pages UI (eg. navbar)
  - [ ] Transaction feed looks like Starling's transaction feed
  - [ ] Savings spaces look like Starling's transaction feed
- [ ] User can select/deselect individual transactions to apply to the roundup total
- [ ] User can filter by transaction category and transaction direction
- [ ] User can see some sort of animation when the roundup transaction is applied to encourage saving

---

### Registering for the Starling Sandbox & Testing Endpoints via the Sandbox and Postman

- Next, I registered with the Starling API

  - I wanted to make sure I could access the endpoints without issue as early on as possible in case of possible blockers

- Registered a tech test application, created sandbox users & simulated transactions

  - This was quite easy to do on Starling's sandbox site. I was anticipating this part to be trickier so that was great!

- Tested endpoints on Postman
  <img width="1300" alt="Screenshot 2025-03-21 at 06 24 08" src="https://github.com/user-attachments/assets/e2fe2030-6a09-464b-97d8-5430d722b733" />

  - Tested the endpoints for the "User can log in" requirement & "User can see their transaction feed for a given week"
  - Given the endpoint for the transaction feed required the user's selected account's `accountUid` & `categoryUid`, I opted to use **`GET /api/v2/accounts`** as this gave me the relevant information with fewer calls & would error if the token was expired

- Scaffolded Project with Nuxt, Vercel & Tailwind
  - For the framework I chose Nuxt3, as this is what I currently use at Just Eat for my team's projects, so I have the most recent practice with it out of all possible frameworks.
  - For styling, I opted to integrate Tailwind, for the same reasons above.
  - I really wanted to deploy the site live, and have some familiarity with Vercel, so I opted for the [Basic Nuxt3 Boilerplate](https://vercel.com/templates/nuxt/nuxtjs-boilerplate) from Vercel.
  - My initial commits were to try to deploy via Vercel as soon as possible, install Tailwind and make small changes to make sure all the above worked locally and in production.
