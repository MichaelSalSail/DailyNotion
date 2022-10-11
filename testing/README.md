# Testing  

Testing took place over the course of 8 days. The backend assumes all new users register on a Sunday. Since testing began on a Monday, the 'week' node was created and initialized with a value of 1 across all users through Firebase console. Otherwise, the json tree in the database was only updated by running backend/feedback_cron.js on a daily basis. There are 10 possible feedback messages: 4 across all user-types and 6 exclusive to one of 3 user-types. To learn more, visit backend/msg_triggers.js  

You may find the results of the entire testing phase in testing_results.json  
(**NOTE**: All Notion tokens were cleared to preserve privacy.)