// const notionAPI = require('./notionAPI.js');
const utils = require('utils.js');

// GET Firebase Realtime code goes here

// node-cron code goes here

// POST Firebase Realtime code goes here

// This is an example
// lets assume right before node-cron runs on date_09_24_2022,
// this is the data extracted from one of the users.
// boolean statements will use the keys from this json
let example_user= {
    "users": {
      "example": {
        "daily_mood": {
          "date_09_22_2022": 1
        },
        "project": {
          "api_resp": {
            "date_09_23_2022": {
                "getProject": { 
                    pg_name: 'Example Project', 
                    pg_init_time: 'Thu Jul 07 2022 14:16:00 GMT-0400 (Eastern Daylight Time)', 
                    pg_last_edit_time: 'Tue Sep 20 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'
  
                },
                "msgProject": { 
                    object: 'comment',
                    created_time: 'Thu Sep 22 2022 23:37:00 GMT-0400 (Eastern Daylight Time)',
                    content: "You're doing great! Keep it up."
                }
            }
          },
          "timeline": {
            "end_date": "10/06/2022",
            "start_date": "09/07/2022"
          },
          "tokens": {
            "intgr_token": "Internal_Integration_token_value",
            "page_token": "Database_token_value"
          }
        },
        "ques_respon": {
          "answ_1": "Overwork (burnout)",
          "answ_2": "Great",
          "answ_3": [
            "Mon",
            "Wed",
            "Fri"
          ],
          "answ_4": [
            "Early Afternoon (12PM-3PM)",
            "Early Evening (6PM-9PM)"
          ],
          "answ_5": [
            "Sun",
            "Sat"
          ],
          "answ_6": [
            "Early Morning (6AM-9AM)",
            "Night (12AM-5AM)"
          ]
        },
        "template": {
          "api_resp": {
            "date_09_23_2022": {
                "getTemplate": {
                    db_name: 'Database Example for DailyNotion', 
                    db_init_time: 'Tue Aug 02 2022 21:21:00 GMT-0400 (Eastern Daylight Time)', 
                    db_last_edit_time: 'Tue Sep 20 2022 23:44:00 GMT-0400 (Eastern Daylight Time)'
                },
                "updateTemplate": {
                    object: 'page',
                    created_time: 'Thu Sep 22 2022 23:37:00 GMT-0400 (Eastern Daylight Time)',
                    parent: {
                    type: 'database_id',
                    database_id: '12903875-e42d-112e-9690-810719d1c18f' 
                    },
                    properties: {
                    'Question 3': { id: 'UOob', type: 'rich_text', rich_text: [Array] },
                    'Question 4': { id: 'tHma', type: 'rich_text', rich_text: [Array] },
                    'Question 2': { id: 'tc~%40', type: 'rich_text', rich_text: [Array] },
                    'Question 1': { id: 'u%7C%3DI', type: 'rich_text', rich_text: [Array] },
                    Week: { id: 'title', type: 'title', title: [Array] }
                    }
                }
            }
          },
          "tokens": {
            "intgr_token": "Internal_Integration_token_value",
            "page_token": "Database_token_value"
          }
        },
        "feedback": {
            "date_09_23_2022": {
                msg_1: {
                    "text": "Keep it up. You're doing great!",
                    "color": "green"
                }
          }
        }
      }
    }
}
for(prop in example_user.users.example)
    console.log(prop);

// TRIGGERS
                    // GENERAL
// 1. A week passed and you didn't write to template.
// 2. A week passed and didn't write to project page.
// 3. Tracked mood for 7 days in a row.
// 4. Mood is happy for 3 days in a row.

                    // SPECIFIC
// Overwork (burnout)
// 1. Worked 7 days last week.

// Procrastination
// 1. Worked during a day you tend to be less productive.
// 2. Didn't work for a day you tend to be productive.

// Excessive Negative Thinking
// 1. Mood is not happy for 3 days in a row but also productive.
// 2. Mood is not happy for 3 days in a row but also unproductive.
// 3. A majority of days last week the user was productive.