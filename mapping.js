export function mapGitHubToFreshdesk(githubUserData) 
{
    return {
      unique_external_id: githubUserData.login,
      name: githubUserData.name ?? null,
      email: githubUserData.email ?? null,
      twitter_id: githubUserData.twitter_username ?? null,
    };
}

export function mapGitHubToDatabase(githubUserData) 
{
  return {
    username: githubUserData.login,
    name: githubUserData.name,
    accountCreationDate: new Date(githubUserData.created_at), 
  };
}