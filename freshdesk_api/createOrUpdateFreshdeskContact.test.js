import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createOrUpdateFreshdeskContact } from "./contact.js";
import { checkUserInDatabase } from "../database/database.js";

jest.mock("../database/database.js");
const subdomain = "quickbase-task";

const githubUserData = {
  login: "testy",
  name: "Test Testy",
  created_at: "2024-01-01T00:00:00Z",
};

const mockId = 1;

describe("createOrUpdateFreshdeskContact", () => {
  const mock = new MockAdapter(axios);
  const requestUrl = `https://${subdomain}.freshdesk.com/api/v2/contacts`;

  beforeEach(() => {
    mock.reset();
    jest.resetAllMocks();
  });

  it("should create a Freshdesk contact if the user does not exist in the database", async () => {
    checkUserInDatabase.mockResolvedValue(null);
    mock.onPost(requestUrl).reply(201, { id: mockId });

    const result = await createOrUpdateFreshdeskContact(
      githubUserData,
      subdomain
    );

    expect(result).toBe(mockId);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(requestUrl);
  });

  it("should update a Freshdesk contact if the user exists in the database", async () => {
    const mockId = 1;
    checkUserInDatabase.mockResolvedValue(mockId);
    mock.onPut(`${requestUrl}/${mockId}`).reply(200, { id: mockId });

    const result = await createOrUpdateFreshdeskContact(
      githubUserData,
      subdomain
    );

    expect(result).toBe(mockId);
    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].url).toBe(`${requestUrl}/${mockId}`);
  });

  it("should handle errors from Freshdesk API", async () => {
    checkUserInDatabase.mockResolvedValue(null);

    mock.onPost(requestUrl).reply(500);

    await expect(
      createOrUpdateFreshdeskContact(githubUserData, subdomain)
    ).rejects.toThrow("Request failed with status code 500");
  });
});
