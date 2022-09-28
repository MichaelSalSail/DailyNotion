const { Client } = require('@notionhq/client');
const notion_info=require('./notion_tokens.js');

/**
 * Collects user activity on curated DailyNotion template space
 * @param {string} templateIntgr - associated template integration token
 * @param {string} templateId - template page id
 * @return {json} - all relevant page info
 */
const getTemplate = async (templateIntgr, templateId) => {
    // 15 element json
    const response = await templateIntgr.databases.retrieve({ database_id: templateId });
    // 4 relevant elements
    const responseResults = {
        db_name: response.title[0].plain_text,
        // ISO 8601 time -> Date object -> String
        db_init_time: new Date(response.created_time).toString('en', {timezone: 'EST'}),
        db_last_edit_time: new Date(response.last_edited_time).toString('en', {timezone: 'EST'})
    };
    console.log("getTemplate()", responseResults);
    return responseResults;
};

/**
 * Adds a new entry to DailyNotion template space
 * @param {string} templateIntgr - associated template integration token
 * @param {string} templateId - template page id
 * @param {string array} templText - text to put in each database property
 * @return {json} - all relevant page info
 */
const updateTemplate = async (templateIntgr, templateId, templText) => {
    const brackets= {
        open: {
            content: "["
        },
        closed: {
            content: "]"
        }
    }
    const question= {
        annotations: {
            bold: true,
            italic: true
        }
    }

    const response = await templateIntgr.pages.create({
        parent: { database_id: templateId },
        properties: {
            Week: {
                title: [
                    {
                        text: {
                            content: templText[0]
                        }
                    }
                ]
            },
            "Question 1": {
                rich_text: [
                    {
                        text: brackets["open"]
                    },
                    {
                        text: {
                            content: templText[1]
                        },
                        annotations: question["annotations"]
                    },
                    {
                        text: brackets["closed"]
                    }
                ]
            },
            "Question 2": {
                rich_text: [
                    {
                        text: brackets["open"]
                    },
                    {
                        text: {
                            content: templText[2]
                        },
                        annotations: question["annotations"]
                    },
                    {
                        text: brackets["closed"]
                    }
                ]
            },
            "Question 3": {
                rich_text: [
                    {
                        text: brackets["open"]
                    },
                    {
                        text: {
                            content: templText[3]
                        },
                        annotations: question["annotations"]
                    },
                    {
                        text: brackets["closed"]
                    }                      
                ]
            },
            "Question 4": {
                rich_text: [
                    {
                        text: brackets["open"]
                    },
                    {
                        text: {
                            content: templText[4]
                        },
                        annotations: question["annotations"]
                    },
                    {
                        text: brackets["closed"]
                    }
                ]
            }
        }
    });
    const responseResults = {
        object: response.object,
        // ISO 8601 time -> Date object -> String
        created_time: new Date(response.created_time).toString('en', {timezone: 'EST'}),
        parent: response.parent,
        properties: response.properties
    };
    console.log("updateTemplate()", responseResults);
    return responseResults;
};

/**
 * Collects user activity on project page
 * @param {string} projIntgr - associated project integration token
 * @param {string} projId - project page id
 * @return {json} - all relevant page info
 */
const getProject = async (projIntgr, projId) => {
    // 12 element json
    const response = await projIntgr.pages.retrieve({ page_id: projId });
    // 4 relevant elements
    const responseResults = {
        pg_name: response.properties.title.title[0].plain_text,
        // ISO 8601 time -> Date object -> String
        pg_init_time: new Date(response.created_time).toString('en', {timezone: 'EST'}),
        pg_last_edit_time: new Date(response.last_edited_time).toString('en', {timezone: 'EST'})
    };
    console.log("getProject()", responseResults);
    return responseResults;
};

/**
 * Adds a new comment to project page
 * @param {string} projIntgr - associated project integration token
 * @param {string} projId - project page id
 * @param {string} feedback - comment text
 * @return {json} - all relevant page info
 */
const msgProject = async (projIntgr, projId, feedback) => {
    const response = await projIntgr.comments.create({
        parent: {
            "page_id": projId
        },
        rich_text: [
            {
                "text": {
                "content": feedback
                }
            }
        ]
    });
    const responseResults = {
        object: response.object,
        // ISO 8601 time -> Date object -> String
        created_time: new Date(response.created_time).toString('en', {timezone: 'EST'}),
        content: response.rich_text[0].plain_text
    };
    console.log("msgProject()", responseResults);
    return responseResults;
};

//                               CONSTANTS
// Access template page
const templateIntgr = new Client({ auth : notion_info.template.tokens.intgr_token});
const templateId = notion_info.template.tokens.page_token;
// Access project page
const projIntgr = new Client({ auth : notion_info.project.tokens.intgr_token});
const projId = notion_info.project.tokens.page_token;
// All 4 curated Notion template questions
const positivity=["1",
                  "What is 1 thing you are grateful for today?",
                  "What is your most recent success? How proud are you from a scale of 1-10?",
                  "What excites you about your current project?",
                  "Write down 1 reason you should feel confident working on your project this week."]
const balance=["1",
               "How stressed are you from a scale of 1-10? Explain.",
               "What stressors can you remove from your routine this week?",
               "Working smarter > working harder. Think of ways you can work more efficient.",
               "Do you think your workload is sustainable? Should you be taking more breaks?"]
const task_log=["1",
                "Think back to the last time you procrastinated. What was the task and why did you procrastinate?",
                "What is the simplest task you can perform this week to make progress on your project?",
                "When is the earliest you can start?",
                "Are you feeling confident doing this task at this time frame? Why or why not?"]
const goal_set=["1",
                "What was your most recent goal you failed to complete?",
                "Write 3 goals you have atm. Rank them from most interesting to least interesting.",
                "Do you think you can stick w/ your first goal? Can you make it more interesting?",
                "If you find yourself goal switching, what can you do to stay on track?"]
const notion_templates= {
    balance: balance,
    positivity: positivity,
    task_log: task_log,
    goal_set: goal_set
}
// Example feedback for Notion project page
let comment = "You're doing great! Keep it up."

// Run all function calls and catch any errors
try {
    getTemplate(templateIntgr,templateId);
    updateTemplate(templateIntgr,templateId,notion_templates["goal_set"]);
    getProject(projIntgr,projId);
    msgProject(projIntgr,projId,comment);
}
catch(error) {
    console.log(error);
}

// Export functions to run in feedback_cron.js
module.exports= {
    getTemplate: getTemplate,
    updateTemplate: updateTemplate,
    getProject: getProject,
    msgProject: msgProject
}