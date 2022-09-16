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
            is_inline: response.is_inline,
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
updateTemplate(templateIntgr,templateId, templText);

// Adds a new comment to user project space
const msgProject = async () => {

};