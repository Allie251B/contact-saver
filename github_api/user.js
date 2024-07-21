import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const githubToken = process.env.GITHUB_TOKEN;


export async function getGitHubUserData(username) 
{
  const url = `https://api.github.com/users/${username}`;
  const headers = {
    'Authorization': `token ${githubToken}`
  };

  try 
  {
    const response = await axios.get(url, { headers });
    return response.data; 
  } 
  catch (error) 
  {
    console.error(`Error fetching GitHub user: ${error}`);
    return null;
  }
}
