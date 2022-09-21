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
getTemplate(templateIntgr,templateId);

// Adds a new entry to DailyNotion template space
const updateTemplate = async (templateIntgr, templateId, templText) => { 
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
                            text: {
                                content: templText[1]
                            }
                        }
                    ]
                },
                "Question 2": {
                    rich_text: [
                        {
                            text: {
                                content: templText[2]
                            }
                        }
                    ]
                },
                "Question 3": {
                    rich_text: [
                        {
                            text: {
                                content: templText[3]
                            }
                        }
                    ]
                },
                "Question 4": {
                    rich_text: [
                        {
                            text: {
                                content: templText[4]
                            }
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
let templText=["1",
               "[What is 1 thing you are grateful for today?]",
               "[What is your most recent success? How proud are you from a scale of 1-10?]",
               "[What excites you about your current project?]",
               "[Write down 1 reason you should feel confident working on your project this week.]"]
// updateTemplate(templateIntgr,templateId, templText);


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
getProject(projIntgr,projId);

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