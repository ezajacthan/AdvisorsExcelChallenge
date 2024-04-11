## Questions

### Please provide instructions on how to run your project in a bulleted list below.
* Clone the repository (found here: https://github.com/ezajacthan/AdvisorsExcelChallenge)
* Navigate to the newly cloned repository
* In a command terminal, run `npm install`
* Once that finishes successfully, run `docker-compose up -d` to start the database container
* Run `npm start` to run the program.

Note: this project requires Node/NPM to already be installed and accessible in whatever directory you clone the repository. See the next question for more details.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
As I mentioned above, I did not have time to containerize the Node/NPM instance for the project so that it would be able to be run purely from a container, but that would be one improvement I would make. Also documented in the code is a known bug where a successful UPDATE for withdraw/deposit but a failed INSERT into the transaction table as well as a failed UPDATE to revert the deposit/withdrawal would result in an untraceable withdraw/deposit. I documented in the code several potential solutions (doing both INSERT and UPDATE in a stored procedure, waiting to commit until both INSERT and UPDATE finished successfully, etc.) as well as where in the code solutions or a hotfix would go if this was a full application. Also, due to my inexperience in React beyond the basics, it would have taken me too long to develop a React GUI to operate this ATM within the time frame mentioned, but I felt like it would have been in the spirit of the project, so I wanted to mention it here.

### If you were to continue building this out, what would you like to add next?
If I were to continue to develop this project, I would add the fixes mentioned above (containerize the project, resolve untraceable deposit/withdrawal bug, add in a GUI) first off, but then I would also want to add security credentials for each user and utilize those credentials in the sign-in process, use credentials to display all accounts for a specific user once logged in, extract withdraw/deposit/balance checks to an API layer that the frontend could call (but would be a detached microservice of its own), create a daily report that can be sent to each user detailing the transactions that took place on their account in that day, and add additional banking features such as the ability to perform a money transfer between all user accounts.

### If you have any other comments or info you'd like the reviewers to know, please add them below.
For reference, I was told that though there was no official time constraint, around 48 hours was the ideal timeframe, so I operated with that as my goal. When I mention that I ran out of time, I had in mind being past the 48 hours from receiving the challenge.