export default defineEventHandler(async (event) => {
  console.log("Get Event in server:", event);
  const { endpoint } = event.context.params;

  const baseUrl = "https://api-sandbox.starlingbank.com/api/v2/";

  const url = `${baseUrl}${endpoint}`;

  const sessionToken = event.node.req.headers["session-token"];
  console.log("Session token in server:", sessionToken);
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

    return response;

    // return {
    //   statusCode: 200,
    //   statusMessage: "Success",
    //   data: {
    //     endpoint,
    //     sessionToken,
    //     url,
    //     event,
    //     type: event.method,
    //   },
    // };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching data from Starling API",
      data: error,
    });
  }
});
