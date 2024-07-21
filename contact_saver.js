import { getGitHubUserData } from './github_api/user.js';
import { createOrUpdateFreshdeskContact } from './freshdesk_api/contact.js'; //switch to createOrUpdateFreshdeskContactByExtId based on if you want to use databases
import { addOrUpdateUserAndDomain } from './database/database.js';
import readlineSync from 'readline-sync';

function getCommandLineArgs() 
{
  const githubUsername = readlineSync.question('Enter the GitHub username: ');
  const freshdeskSubdomain = readlineSync.question('Enter the Freshdesk subdomain: ');
  return { githubUsername, freshdeskSubdomain };
}

(async () => {
  try 
  {
    const { githubUsername, freshdeskSubdomain } = getCommandLineArgs();
    const githubUser = await getGitHubUserData(githubUsername);
    if (githubUser === null)
    {
        return;
    }
    const recordId = await createOrUpdateFreshdeskContact(githubUser, freshdeskSubdomain); //switch to createOrUpdateFreshdeskContactByExtId based on if you want to use databases
    if (recordId === null)
    {
        console.error("Error writing to Freshdesk", error);
        return;
    }
        await addOrUpdateUserAndDomain(githubUser, freshdeskSubdomain, recordId); //comment/uncoment based on if you want to use databases
  } 
  catch (error) 
  {
    console.error('An error occurred:', error);
  }
})();
