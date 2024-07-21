import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getGitHubUserData } from "./user";
import dotenv from "dotenv";

dotenv.config();

describe("getGitHubUserData", () => {
  const mock = new MockAdapter(axios);
  const githubToken = process.env.GITHUB_TOKEN;
  const requestUrl = "https://api.github.com/users";

  beforeEach(() => {
    mock.reset();
  });

  it("should send a correct request to the desired URL, exactly once and it should have the auth token", async () => {
    // Because there is no adequate way to check the response with a unit test as it is mocked this needs end to end tests and we don't need a full response mock.
    const username = "testy";
    const userData = {
      login: username,
      id: 123456,
      name: "Test Testov",
      twitter_username: "testy123",
    };

    mock.onGet(`${requestUrl}/${username}`).reply(200, userData);

    const result = await getGitHubUserData(username);

    expect(result).toEqual(userData);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(`${requestUrl}/${username}`);
    expect(mock.history.get[0].headers.Authorization).toBe(
      `token ${githubToken}`
    );
  });

  it("should handle errors from the GitHub API", async () => {
    const username = "invaliduser";

    mock.onGet(`${requestUrl}/${username}`).reply(404);

    const result = await getGitHubUserData(username);

    expect(result).toBeNull();
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(`${requestUrl}/${username}`);

    mock.onGet(`${requestUrl}/${username}`).reply(404);
    expect(async () => await getGitHubUserData(username)).not.toThrow();

    mock.onGet(`${requestUrl}/${username}`).reply(500);
    expect(async () => await getGitHubUserData(username)).not.toThrow();
  });
});
