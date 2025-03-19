// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "~/server/api/starling/[...endpoint].js";
import { getQuery } from "h3";

vi.stubGlobal("$fetch", vi.fn());

describe("Starling API Handler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return an error if session token is missing", async () => {
    const event = {
      context: { params: { endpoint: "test-endpoint" } },
      node: { req: { headers: {} } },
    };

    await expect(handler(event)).rejects.toThrowError(
      "Session token is required"
    );
  });

  it.each([
    // Test case 1: POST request with query parameters and body
    [
      {
        method: "POST",
        query: { param1: "value1", param2: "value2" },
        body: { key: "value" },
        expectedUrl:
          "https://api-sandbox.starlingbank.com/api/v2/test-endpoint?param1=value1&param2=value2",
        expectedBody: { key: "value" },
        expectedData: { success: true },
        expectedRequest: {
          endpoint: "test-endpoint",
          url: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint?param1=value1&param2=value2",
          requestType: "POST",
        },
      },
    ],
    // Test case 2: GET request with query parameters, no body
    [
      {
        method: "GET",
        query: { param1: "value1" },
        expectedUrl:
          "https://api-sandbox.starlingbank.com/api/v2/test-endpoint?param1=value1",
        expectedBody: undefined,
        expectedData: { success: true },
        expectedRequest: {
          endpoint: "test-endpoint",
          url: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint?param1=value1",
          requestType: "GET",
        },
      },
    ],
    // Test case 3: POST request with only body, no query parameters
    [
      {
        method: "POST",
        body: { key: "value" },
        expectedUrl:
          "https://api-sandbox.starlingbank.com/api/v2/test-endpoint",
        expectedBody: { key: "value" },
        expectedData: { success: true },
        expectedRequest: {
          endpoint: "test-endpoint",
          url: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint",
          requestType: "POST",
        },
      },
    ],
    // Test case 4: GET request with no query parameters and no body
    [
      {
        method: "GET",
        expectedUrl:
          "https://api-sandbox.starlingbank.com/api/v2/test-endpoint",
        expectedBody: undefined,
        expectedData: { success: true },
        expectedRequest: {
          endpoint: "test-endpoint",
          url: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint",
          requestType: "GET",
        },
      },
    ],
  ])(
    "should call the API and return the correct data and request details for %s",
    async ({
      method,
      query,
      body,
      expectedUrl,
      expectedBody,
      expectedData,
      expectedRequest,
    }) => {
      const event = {
        context: { params: { endpoint: "test-endpoint" } },
        node: {
          req: {
            headers: {
              "session-token": "test-token",
              "content-type": "application/json",
            },
            query,
            body,
          },
        },
        method,
      };

      // Mocking the API response
      $fetch.mockResolvedValue(expectedData);

      const result = await handler(event);

      // Check the URL with query parameters
      expect($fetch).toHaveBeenCalledWith(expectedUrl, {
        method,
        headers: {
          Authorization: "Bearer test-token",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: expectedBody ? JSON.stringify(expectedBody) : undefined,
      });

      // Check the returned response data
      expect(result).toEqual({
        data: expectedData,
        request: expectedRequest,
      });
    }
  );

  it("should return the error if API request fails", async () => {
    const event = {
      context: { params: { endpoint: "test-endpoint" } },
      node: { req: { headers: { "session-token": "test-token" } } },
      method: "GET",
    };

    const error = new Error("API Error");
    $fetch.mockRejectedValue(error);

    const result = await handler(event);
    expect(result).toBe(error);
  });
});
