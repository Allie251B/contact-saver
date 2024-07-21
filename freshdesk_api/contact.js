import { mapGitHubToFreshdesk } from '../mapping.js';
import { checkUserInDatabase } from '../database/database.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const freshdeskToken = process.env.FRESHDESK_TOKEN

export async function createOrUpdateFreshdeskContact(githubUserData, subdomain) {
  
  const url = `https://${subdomain}.freshdesk.com/api/v2/contacts`;
  const contact = mapGitHubToFreshdesk(githubUserData);
  console.log(contact);
  let response;

  try {
    const recordId = await checkUserInDatabase(contact.unique_external_id,subdomain);
    if (recordId!=null) {
      response = await axios.put(`${url}/${recordId}`, contact, {
        auth: {
          username: freshdeskToken,
          password: ''
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Contact updated successfully.');
    } else {
      response = await axios.post(url, contact, {
        auth: {
          username: freshdeskToken,
          password: ''
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }); 
      console.log('Contact created successfully.');
    }
  } catch (error) {
    console.error(`Error creating/updating Freshdesk contact: ${error}`);
    throw error;
  }
  return response.data.id;
}


//Functions for the solution that does not use databases:

export async function createOrUpdateFreshdeskContactByExtId(githubUserData, subdomain) {
  const url = `https://${subdomain}.freshdesk.com/api/v2/contacts`;
  const contact = mapGitHubToFreshdesk(githubUserData);
  // console.log(contact);
  let response;

  try {
    const recordId = await getContactIdByUniqueExternalId(contact.unique_external_id, subdomain);

    if (recordId != null) {
      response = await axios.put(`${url}/${recordId}`, contact, {
        auth: {
          username: freshdeskToken,
          password: ''
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Contact updated successfully.');
    } else {
      response = await axios.post(url, contact, {
        auth: {
          username: freshdeskToken,
          password: ''
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Contact created successfully.');
    }
  } catch (error) {
    console.error(`Error creating/updating Freshdesk contact: ${error}`);
    throw error;
  }
  return response.data.id;
}


export async function getContactIdByUniqueExternalId(uniqueExternalId, subdomain) {
  const url = `https://${subdomain}.freshdesk.com/api/v2/contacts?unique_external_id=${uniqueExternalId}`;
  
  try {
    const response = await axios.get(url, {
      auth: {
        username: freshdeskToken,
        password: ''
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching contact by unique_external_id: ${error}`);
    throw error;
  }
}