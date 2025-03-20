# Frontend Tech Test - Claire Peng

This is the frontend tech test of Claire Peng for Starling. The live site is deployed [here](https://starling-fe-tech-test.vercel.app/spaces)

This project uses the following tech:

| **Category**   | **Tool**                |
|-----------------|------------------------|
| Framework        | Nuxt 3                |
| Deployment       | Vercel                |
| Testing          | Vitest                |
| Styling          | Tailwind, Pie Library |

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

Note: the test for the proxy/middleware has two failing tests because I wasn't able to figure out how to mock `ofetch`/`h3`'s `getQuery` method for the test, however in manual testing it behaves as expected. All other tests should pass as expected. Notes on challenges around the proxy server & using Nuxt's `$fetch` will follow in the implementation notes (TODO).

```
npm run test
```
