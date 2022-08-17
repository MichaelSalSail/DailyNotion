const { Client } = require('@notionhq/client');
var bodyParser = require('body-parser')

// const app = express();

// suppress GitGuardian alert by placing Notion tokens
// in a seperate .js file
const get_notion_tokens=require('./notion_tokens.js');

// integration token
const notion = new Client({ auth : get_notion_tokens.intgr_token});
// database token
const databaseId = get_notion_tokens.page_token;

// Sends GET request to Notion database for metadata
const getDatabase = async () => {
    try {
        // 15 element json
        const response = await notion.databases.retrieve({ database_id: databaseId });

        // view entire json
        // console.log(response);

        // 4 relevant elements
        const responseResults = 
            {
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
getDatabase();

// TO-DO: Obtain row data from database
// I think you need to use notion.databases.query
/*const queryDatabase = async () => {
    try {
        const response = await notion.databases.query({ database_id: databaseId });

        console.log(response)
    }
    catch(error) {
        console.log(error);
    }
};*/

// Sends a POST request to Notion database to create a new page
const updateDatabase = async () => { 
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
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
        console.log(response);
    }
    catch(error) {
        console.log(error);
    }
};
updateDatabase();