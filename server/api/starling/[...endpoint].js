import { defineEventHandler, createError } from "h3";
import { getQuery } from "h3";
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
  console.log("proxy url", url);
  console.log("event", event);

  const queryParams = getQuery(event);

  if (queryParams && Object.keys(queryParams).length > 0) {
    console.log("queryParams", queryParams);
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
    console.log("query url", url);
  }

  try {
    const response = await $fetch(url, {
      method: event.method,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: event.node.req.body
        ? JSON.stringify(event.node.req.body)
        : undefined,
    });

    return {
      data: response,
      request: {
        endpoint,
        url,
        requestType: event.method,
      },
    };
  } catch (error) {
    return error;
  }
});
