export default defineEventHandler(async (event) => {
  const { endpoint } = event.context.params;

  const baseUrl = "https://api-sandbox.starlingbank.com/api/v2/";

  const url = `${baseUrl}${endpoint}`;

  const sessionToken = event.node.req.headers["session-token"];
  if (!sessionToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Session token is required",
    });
  }

  try {
    const response = await $fetch(url, {
      method: event.method,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
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
