# Day 2 - March 7th:

### Styling Skeleton

- Went on Starling's site and inspected for colour tokens and used these to extend on Tailwind
- Ended up not using these so much because I don't know what the names refer to so it was easier to use Tailwind defaults and eyeball the colours
- Also spent time getting the Starling Logo and favoricon
- I like applying these right away on a project to get a feel for the branding

<img src="./images/Getting Login page colour codes.png"/>
<img src="./images/Getting landing page colour codes.png"/>

<br>

- I then styled the landing and login pages to match Starling as much as possible across all screen sizes.

<img src="./images/Landing page attempt.png"/>
<img src="./images/Login page attempt.png"/>

<hr>

### Login Sequence with `GET /api/v2/accounts`

- Add pinia for state storage -- similar to redux in React
  - In the project I work on at Just Eat, we store use a Pinia store for userIdentity so that it's accessible throughout the app, and also store it in the browser local storage, so I opted to implement this pattern as well.
- Added the [notification store](../store/notifications.ts), and the [user identity store](../store/userIdentity.ts). See co-located tests for their responsibilities.
- Installed the [Pie Design System - Just Eat's public component library](https://www.pie.design/)
  - I couldn't find a public Starling Component Library, so I opted to use this one due to familiarity.
  - This allowed me easy access to [icons](https://www.pie.design/foundations/iconography/library/) and components like the [Toast notification](https://www.pie.design/components/toast/)

#### CORS Error and proxy server:

- Attempted to login directly calling API -- encountered CORS error
- Looked at Starling Developers responses & did research on CORS

- Couldn't really understand from docs online, so I asked ChatGPT to explain this in non-technical terms

  - Essentially the Starling Backend will not allow attempts to access their services **from a browser** if the caller's origin is not on Starling's approved list of endpoints.
  - As an external developer I have no control over this list of approved browsers
    - I registered the deployed site's URL & localhost3000 to my sandbox app, but this didn't resolve the issue
  - CORS errors only apply to **browser/client** requests, which is why I could not access the endpoint from the browser, but I can from Postman
  - I needed to add an internal server whose responsibility is just to:
    - Take my client-side request to this internal server
    - Pass on the request (including query params, body, headers) to the Starling API
    - Receive any responses or errors from the Starling API
    - Return the responses/errors to my browser/client.

- I tried to look online for example code, but wasn't able to find anything I could understand easily for this use case, as this is my first time making a proxy, so I ended up asking ChatGPT for boilerplate for a Nuxt 3 proxy these requirements
- This didn't work immediately, so it required some tinkering, but eventually this worked

- [Proxy Server File](../server/api/starling/[...endpoint].js)
  - Calling `/api/starling/:some-endpoint` would send a request to `https://api-sandbox.starlingbank.com/api/v2/:some-endpoint`

<img src="./images/Successfully accessing GET accounts endpoint.png"/>

#### $fetch and Error Handling:

- **However:** Nuxt3 comes pre-packaged with `$fetch`, which is a wrapper for `ofetch` ([link to docs](https://nuxt.com/docs/api/utils/dollarfetch))

  - We use `axios` at work, so I wasn't super familiar with this package, but I thought it would be good to learn, and I hadn't installed `axios` before, so I opted to use the inbuilt `$fetch` in the interest of time.
  - `ofetch` has some inbuilt error handling, where it returns [an error string](../types/responseError.type.ts) instead of the full error object, so I found this made it harder to debug.
  - I could see the error string in the error notification, but more details about the error in the network response, which I couldn't access in my data-fetching function in the app for some reason.
  - Using `$fetch` also caused later additional issues to debug around query params and request bodies (see proceeding days.)

- **If I were to redo the project, I would set it up to use the native `fetch` to have greater control over the request handling.**

<hr>

### Install Vitest & Unit testing

- Add vitest for unit testing -- opted for this due to familiarity

- Went back to existing components and added unit tests for the behaviour/refactored for isolation of responsibilities
- I did a lot of refactoring at this point to make sure everything was secure and easy to maintain, as my original scaffolding was quick and dirty.

- The above is generally my working pattern:
  - Make skeleton of feature based on mental list of requirements
  - Refactor into componenents
  - Add unit tests for components & refactor for isolation of responsibilities
  - PR/deploy

<hr>
