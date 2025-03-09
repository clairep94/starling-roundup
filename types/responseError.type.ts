// This is the format of the error type that starling API responds with,
// but Nuxt uses ofetch as a wrapper for $fetch as default, which handles errors by throwing them directly as 
// a combination of the error.statusCode, error.statusMessage, error.url
// it does not include the error.data

// eg. for the below error:
// {
//   "url": "/api/starling/identity/individual",
//   "statusCode": 403,
//   "statusMessage": "Forbidden",
//   "message": "[GET] \"https://api-sandbox.starlingbank.com/api/v2/identity/individual\": 403 Forbidden",
//   "stack": "<pre><span class=\"stack internal\">at process.processTicksAndRejections (node:internal/process/task_queues:95:5)</span>\n<span class=\"stack internal\">at async $fetchRaw2 (./node_modules/ofetch/dist/shared/ofetch.03887fc3.mjs:270:14)</span>\n<span class=\"stack internal\">at async $fetch2 (./node_modules/ofetch/dist/shared/ofetch.03887fc3.mjs:316:15)</span>\n<span class=\"stack\">at async Object.handler (./.nuxt/dev/index.mjs:1454:22)</span>\n<span class=\"stack internal\">at async ./node_modules/h3/dist/index.mjs:2009:19</span>\n<span class=\"stack internal\">at async Object.callAsync (./node_modules/unctx/dist/index.mjs:72:16)</span>\n<span class=\"stack internal\">at async Server.toNodeHandle (./node_modules/h3/dist/index.mjs:2301:7)</span></pre>",
//   "data": {
//       "error": "invalid_token",
//       "error_description": "Access token has expired"
//   }
// }

// ofetch returned error:
// Fetch Error: [GET] /api/starling/identity/individual
// 403 Forbidden

// If given unlimited time, I would implement another fetch wrapper that would return the entire error object

/**
 * Starling API error type
 */
export type StarlingErrorResponse = {
  url: string,
  statusCode: number,
  statusMessage: string,
  message: string,
  stack: string,
  data: {
      error: string,
      error_description: string
  }
}

export type OfetchError = string

export function generateOfetchError(method: string, url: string, statusCode: number, statusMessage: string): OfetchError {
  return `Fetch Error: [${method}] ${url}\n${statusCode} ${statusMessage}`
}