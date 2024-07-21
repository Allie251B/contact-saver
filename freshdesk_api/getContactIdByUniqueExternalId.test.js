import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getContactIdByUniqueExternalId } from "./contact.js";

jest.mock("../database/database.js");
const subdomain = "quickbase-task";
const mockId = 1;

describe("getContactIdByUniqueExternalId", () => {
  const mock = new MockAdapter(axios);
  const uniqueExternalId = "testy";
  const requestUrl = `https://${subdomain}.freshdesk.com/api/v2/contacts?unique_external_id=${uniqueExternalId}`;

  beforeEach(() => {
    mock.reset();
  });

  it("should return the contact ID if the contact exists", async () => {
    const contactData = [{ id: mockId }];

    mock.onGet(requestUrl).reply(200, contactData);

    const result = await getContactIdByUniqueExternalId(
      uniqueExternalId,
      subdomain
    );

    expect(result).toBe(mockId);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(requestUrl);
  });

  it("should return null if the contact does not exist", async () => {
    mock.onGet(requestUrl).reply(200, []);

    const result = await getContactIdByUniqueExternalId(
      uniqueExternalId,
      subdomain
    );

    expect(result).toBeNull();
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(requestUrl);
  });

  it("should handle errors from Freshdesk API", async () => {
    mock.onGet(requestUrl).reply(500);

    await expect(
      getContactIdByUniqueExternalId(uniqueExternalId, subdomain)
    ).rejects.toThrow("Request failed with status code 500");
  });
});
