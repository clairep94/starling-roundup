import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // error if no session token
  const sessionToken = event.node.req.headers["session-token"];
  if (!sessionToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Session token is required",
    });
  }

  // construct the starling endpoint url
  const { endpoint } = event.context.params;
  const baseUrl = "https://api-sandbox.starlingbank.com/api/v2/";

  let url = `${baseUrl}${endpoint}`;

  if(event.node.req.query){ //add query params if there any
    let queries = []
    Object.entries(event.node.req.query).forEach(([key, value]) => {
      queries.push(`${key}=${value}`)
    });
    url = url + '?' + queries.join('&')
    console.log(url)
  }

  try {
    const response = await $fetch(url, {
      method: event.method,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: event.node.req.body? JSON.stringify(event.node.req.body) : undefined
    });

    return {
      data: response,
      request: {
        endpoint,
        sessionToken,
        url,
        event,
        type: event.method,
      },
    };
  } catch (error) {
    return error;
  }
});
