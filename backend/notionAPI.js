const { Client } = require('@notionhq/client');

const notion_info=require('./notion_tokens.js');

// Access template page
const templateIntgr = new Client({ auth : notion_info.template.tokens.intgr_token});
const templateId = notion_info.template.tokens.page_token;
// Access project page
const projIntgr = new Client({ auth : notion_info.project.tokens.intgr_token});
const projId = notion_info.project.tokens.page_token;

// Collects user activity on curated DailyNotion template space
const getTemplate = async (templateIntgr, templateId) => {
    try 
    {
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
    }
    catch(error) {
        console.log("getTemplate()", error);
    }
};
// getTemplate(templateIntgr,templateId);

// Adds a new entry to DailyNotion template space
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
    try {
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
        console.log("updateTemplate()", response);
    }
    catch(error) {
        console.log("updateTemplate()", error);
    }
};
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
updateTemplate(templateIntgr,templateId,notion_templates["goal_set"]);


// Collects user activity on project space
const getProject = async (projIntgr, projId) => {
    try 
    {
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
    }
    catch(error) {
        console.log("getProject()", error);
    }
};
// getProject(projIntgr,projId);

// Adds a new comment to project space
const msgProject = async (projIntgr, projId, feedback) => {
    try {
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
        console.log("msgProject()", response);
    }
    catch(error)
    {
        console.log("msgProject()", error);
    }
};
let comment = "You're doing great! Keep it up."
// msgProject(projIntgr,projId,comment);