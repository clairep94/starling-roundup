export default defineEventHandler(async (event) => {
  console.log("Get Event in server:", event);
  const { endpoint } = event.context.params;

  const baseUrl = "https://api-sandbox.starlingbank.com/api/v2/";

  const url = `${baseUrl}${endpoint}`; // e.g. /api/v2/accounts, /api/v2/transactions, etc.

  // Get the session token from the headers
  const sessionToken = event.node.req.headers["session-token"];
  console.log("Session token in server:", sessionToken);
  if (!sessionToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Session token is required",
    });
  }

  try {
    // const response = await $fetch(url, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${sessionToken}`,
    //     "Content-Type": "application/json",
    //   },
    // });

    // return response;

    return {
      statusCode: 200,
      statusMessage: "Success",
      data: {
        endpoint,
        sessionToken,
        url,
      },
    };
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching data from Starling API",
      data: error,
    });
  }
});
