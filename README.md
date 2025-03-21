# Frontend Tech Test - Claire Peng

This is the frontend tech test of Claire Peng for Starling. <br>

**The live site is deployed [here](https://starling-fe-tech-test.vercel.app/spaces).**

**Implementation notes start [here](./tech-test-notes/Day1.md)**

**NOTE:**
This project assumes that users can only apply top-ups to transactions that are OUTGOING & that are NOT "INTERNAL_TRANSFERS"

- I believe this is the behaviour on the Starling app as a current user.
- If you do not see possible roundups to apply, please simulate some transactions via the Starling Sandbox, or change your date range to include applicable transactions.

<img src="./tech-test-notes/images/Landing.png"/>

<br>

<img src="./tech-test-notes/images/Login.png"/>

<br>

<img src="./tech-test-notes/images/Transaction Feed.png"/>

<br>

<hr>

This project uses the following tech:

| **Category** | **Tool**              |
| ------------ | --------------------- |
| Framework    | Nuxt 3                |
| Deployment   | Vercel                |
| Testing      | Vitest                |
| Styling      | Tailwind, Pie Library |

## Setup

```bash
npm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Testing

**Note:** <br>
_The test for the proxy/middleware has two failing tests because I wasn't able to figure out how to mock `ofetch`/`h3`'s `getQuery` method for the test, however in manual testing it behaves as expected. All other tests should pass as expected. Notes on challenges around the proxy server & using Nuxt's `$fetch` are in the [implementation notes](./tech-test-notes/Day2.md)._

```
npm run test
```

## TODO:

- If user has a token saved that should time out, it should auto-logout
- User can filter
