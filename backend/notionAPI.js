const { Client } = require('@notionhq/client');

const get_notion_tokens=require('./notion_tokens.js');

// integration token
const notion = new Client({ auth : get_notion_tokens.intgr_token});
// page tokens
const templateId = get_notion_tokens.templ_token;
const projId = get_notion_tokens.proj_token;

// Collects user activity on curated DailyNotion template space
const getTemplate = async (templateId) => {
    try 
    {
        // 15 element json
        const response = await notion.databases.retrieve({ database_id: templateId });

        // view entire json
        // console.log(response);

        // 4 relevant elements
        const responseResults = {
            db_name: response.title[0].plain_text,
            is_inline: response.is_inline,
            // ISO 8601 time -> Date object -> String
            db_init_time: new Date(response.created_time).toString('en', {timezone: 'EST'}),
            db_last_edit_time: new Date(response.last_edited_time).toString('en', {timezone: 'EST'})
        };
        
        console.log(responseResults);
        return responseResults;
    }
    catch(error) {
        console.log(error);
    }
};
getTemplate();

// Adds a new entry to DailyNotion template space
const updateTemplate = async (templateId) => { 
    try {
        const response = await notion.pages.create({
            parent: { database_id: templateId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: "Jay"
                            }
                        }
                    ]
                },
                "Phone Number": {
                    rich_text: [
                        {
                            text: {
                                content: "333-222-1111"
                            }
                        }
                    ]
                },
                "Extra Information": {
                    rich_text: [
                        {
                            text: {
                                content: "I like to design on Figma"
                            }
                        }
                    ]
                }
            }
        });
        return response;
    }
    catch(error) {
        return error;
    }
};
// updateTemplate();

// Adds a new comment to user project space
const msgProject = async () => {

};