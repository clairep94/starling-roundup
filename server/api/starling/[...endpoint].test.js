// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "~/server/api/starling/[...endpoint].js";

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

    await expect(handler(event)).rejects.toThrowError("Session token is required");
  });

  it.each([
    // Test case 1: POST request with query parameters and body
    [
      { 
        method: "POST",
        query: { param1: "value1", param2: "value2" },
        body: { key: "value" },
        expectedUrl: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint?param1=value1&param2=value2",
        expectedBody: { key: "value" },
      },
    ],
    // Test case 2: GET request with query parameters, no body
    [
      { 
        method: "GET",
        query: { param1: "value1" },
        expectedUrl: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint?param1=value1",
        expectedBody: undefined,
      },
    ],
    // Test case 3: POST request with only body, no query parameters
    [
      { 
        method: "POST",
        body: { key: "value" },
        expectedUrl: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint",
        expectedBody: { key: "value" },
      },
    ],
    // Test case 4: GET request with no query parameters and no body
    [
      { 
        method: "GET",
        expectedUrl: "https://api-sandbox.starlingbank.com/api/v2/test-endpoint",
        expectedBody: undefined,
      },
    ],
  ])(
    "should call the API with the correct parameters",
    async ({ method, query, body, expectedUrl, expectedBody }) => {
      const event = {
        context: { params: { endpoint: "test-endpoint" } },
        node: { 
          req: { 
            headers: { "session-token": "test-token" },
            query, // Passing query dynamically
            body, // Passing body dynamically
          } 
        },
        method, // Dynamically set method
      };
  
      $fetch.mockResolvedValue({ success: true });
  
      const result = await handler(event);
  
      // Check the URL with query parameters
      expect($fetch).toHaveBeenCalledWith(
        expectedUrl,
        {
          method,
          headers: {
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          },
          body: expectedBody ? JSON.stringify(expectedBody) : undefined, // Only pass body if it exists
        }
      );
    }
  );
  

  // it("should return the request result data and the request details")

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
