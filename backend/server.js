const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// const app = express();

// suppress GitGuardian alert by placing Notion tokens
// in a seperate .js file
const get_notion_tokens=require('./notion_tokens.js');

// avoid cors errors
// app.use(cors());

// const PORT = 4000;
// const HOST = "localhost";

// integration token
const notion = new Client({ auth : get_notion_tokens.intgr_token});
// database token
const databaseId = get_notion_tokens.page_token;

// Sends GET request for Notion database meta-data
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

// POST request
// POST name, phoneNumber, extraInfo
// Functionality: Make a database entry in a Notion page w/ the databaseId above
// localhost:4000/submitFormNotion
// app.post('/submitFormToNotion', jsonParser, async (req, res) => {
    // req.body
    /*{
        name: "Michael Salamon",
        phoneNumber: "Michael Salamon",
        extraInfo: "Michael Salamon"
    }*/
/*
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const extraInfo = req.body.extraInfo;

    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },
                "Phone Number": {
                    rich_text: [
                        {
                            text: {
                                content: phoneNumber
                            }
                        }
                    ]
                },
                "Extra Information": {
                    rich_text: [
                        {
                            text: {
                                content: extraInfo
                            }
                        }
                    ]
                }
            }
        })
        console.log(response);
        console.log("SUCCESS!")
    }
    catch(error) {
        console.log(error);
    }
});*/

// To-do:
// 1. Change POST request to contain hard-coded data
// 2. Make a GET request that extracts relevant data

/*
app.listen(PORT, HOST, () => {
    console.log("Starting proxy at " + HOST + ":" + PORT); // localhost:4000
});*/

