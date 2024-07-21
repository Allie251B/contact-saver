import { mapGitHubToDatabase } from '../mapping.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function checkUserInDatabase(username, domainName) 
{    
  try 
  {
    const user = await prisma.gitHubUsers.findUnique({
      where: { username: username },
      select: { id: true } 
    });
  
    if (!user) 
      {
        return null;
      }

    const domain = await prisma.domains.findUnique({
      where: { name: domainName },
      select: { id: true }
    });
  
    if (!domain) 
      {
        return null;
      }
  
    const userDomainRelation = await prisma.userDomains.findUnique({
      where: {
        userId_domainId: {
          userId: user.id,
          domainId: domain.id
        }
      }
    });
    
    return userDomainRelation?.recordId ?? null;
    
  } 
  catch (error) 
  {
    console.error('Error checking user in database:', error);
    throw error;
  }
}

export async function addOrUpdateUserAndDomain(githubUserData, domainName, recordId) 
{
    const userData = mapGitHubToDatabase(githubUserData);
    try 
    {
      let domain = await prisma.domains.findUnique({
        where: { name: domainName }
      });
  
      if (!domain) 
      {
        domain = await prisma.domains.create({
          data: { name: domainName }
        });
      }
      let user = await prisma.gitHubUsers.findUnique({
          where: { username: userData.username }
        });
  
      if (!user) 
      {
        user = await prisma.gitHubUsers.create({
          data: {
            username: userData.username,
            name: userData.name,
            accountCreationDate: userData.accountCreationDate
          }
         });
      }
  
      const userDomainRelation = await prisma.userDomains.findUnique({
        where: {
          userId_domainId: {
            userId: user.id,
            domainId: domain.id
          }
        }
      });
      if (!userDomainRelation) 
      {
        await prisma.userDomains.create({
          data: {
            userId: user.id,
            domainId: domain.id,
            recordId: recordId
          }
        });
      } 
      else 
      {
        await prisma.gitHubUsers.update({
            where: { username: userData.username },
            data: {
                name: userData.name,
            }
        });
      } 
      console.log('User and domain added or updated successfully.');
    } 
    catch (error) 
    {
      console.error('Error adding/updating user and domain:', error);
      throw error;
    }
  }