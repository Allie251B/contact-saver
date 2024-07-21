# Quickbase Task

##### A command line program which retrieves the information of a GitHub User and creates/updates a Contact in Freshdesk

---

## Overview


The application is designed to manage the integration of GitHub user data with Freshdesk contacts. The primary components of this program are functions for creating or updating Freshdesk contacts, checking user existence in the database, and adding or updating user and subdomain information.
\
\
This is a simple console application created using **Javascript, Node.js, PostreSQL, PrismaORM. Jest** is also used for **unit testing.**

---

## Requirements

- Install [Node.js](https://nodejs.org/en/download)
- Install [PostgreSQL](https://www.postgresql.org/download/)

You need to generate a GitHub and Flaskdesk tokens beforehand. If you need help generating the tokens you can check out the [GitHub](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28) and [Freshdesk](https://developers.freshdesk.com/api/#getting-started) documentation.



---
## How to run

- Clone the repo 
 ```
 git clone https://github.com/Allie251B/quickbase-task.git
 ```
- Copy .env.template to .env and replace my variables with your generated tokens and [PostgreSQL URL](https://www.prisma.io/docs/orm/overview/databases/postgresql#connection-url).
- Open terminal
- To install all the needed dependancies run:

 ```
 npm  install
 ```


- To create the database and tables run:

```
npx prisma migrate dev  
``` 
``` 
npx prisma generate
``` 

(make sure to also **refresh** your PostreSQL)
- Run the program:
```
$ node contact_saver.js
``` 

If you want to run the tests type
```
$ node test
```


## User interaction

1. When running `contact_saver.js` the program initiates prompt dialogue with the user.

2. The user will be prompted to enter a `GitHub username` and a `subdomain` 
\
Example:

```
Enter the GitHub username: Allie251B
Enter the Freshdesk subdomain: quickbase-task
```

3. If succesful a contact will be created/updated and added to the database and Flashdesk. If not a proper error messege will be displayed.


---
## Important Notes
\
**[1]**  I wanted to make sense of the database existence so i expanded the scope of the bonus task by adding a table for the domains and having a relation between the two tables and checking there for the excistance of the contact. 

I also implemented the solution following the normal task (checking for the excistence of the contact by a simple `get` call and getting the Id of the Contact for the following `put` call). It is marked in the code what needs to be commented/uncommented or switched for it to work.\
\
**[2]** Given the extentention of the task my completion time was around 8-9 hours.
\
\
**[3]** The "creation script" for the database can be found in ```quickbase\prisma\migrations\20240721212100_creation/migration.sql```.
Running the Prisma migration acts as a creation script and creates the database in PostgreSQL if a user hasn't created one yet.
\
\
**[4]** I had some problems when running Jest with ESM. I found this [solution](https://gist.github.com/rstacruz/511f43265de4939f6ca729a3df7b001c) (Metod B) which involved adding Babel config.

## Future improvements
* Better error handling
* End to end testing
* Add unit tests for the database
