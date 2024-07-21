import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createOrUpdateFreshdeskContactByExtId } from "./contact.js";

const subdomain = "quickbase-task";

const githubUserData = {
  login: "testy",
  name: "Test Testy",
  created_at: "2024-01-01T00:00:00Z",
};

const mockId = 1;

describe("createOrUpdateFreshdeskContactByExtId", () => {
  const mock = new MockAdapter(axios);
  const requestUrl = `https://${subdomain}.freshdesk.com/api/v2/contacts`;

  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it("should create a Freshdesk contact if the contact does not exist", async () => {
    mock
      .onGet(`${requestUrl}?unique_external_id=${githubUserData.login}`)
      .reply(200, []);
    mock.onPost(requestUrl).reply(201, { id: mockId });

    const result = await createOrUpdateFreshdeskContactByExtId(
      githubUserData,
      subdomain
    );

    expect(result).toBe(mockId);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(requestUrl);
  });

  it("should update a Freshdesk contact if the contact exists", async () => {
    mock
      .onGet(`${requestUrl}?unique_external_id=${githubUserData.login}`)
      .reply(200, [{ id: mockId }]);
    mock.onPut(`${requestUrl}/${mockId}`).reply(200, { id: mockId });

    const result = await createOrUpdateFreshdeskContactByExtId(
      githubUserData,
      subdomain
    );

    expect(result).toBe(mockId);
    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].url).toBe(`${requestUrl}/${mockId}`);
  });

  it("should handle errors from Freshdesk API", async () => {
    mock
      .onGet(`${requestUrl}?unique_external_id=${githubUserData.login}`)
      .reply(200, []);
    mock.onPost(requestUrl).reply(500);

    await expect(
      createOrUpdateFreshdeskContactByExtId(githubUserData, subdomain)
    ).rejects.toThrow("Request failed with status code 500");
  });
});
