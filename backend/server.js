const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const app = express();

// suppress GitGuardian alert by placing Notion tokens
// in a seperate .js file
const get_notion_tokens=require('./notion_tokens.js');

// avoid cors errors
app.use(cors());

const PORT = 4000;
const HOST = "localhost";

// integration token
const client = new Client({ auth : get_notion_tokens.intgr_token});
// database token
const databaseId = get_notion_tokens.page_token;

// POST request
// POST name, phoneNumber, extraInfo
// Functionality: Make a database entry in a Notion page w/ the databaseId above


app.listen(PORT, HOST, () => {
    console.log("Starting proxy at " + HOST + ":" + PORT); // localhost:4000
});

// To-do:
// 1. Write all the server.js code from the video
// 2. Edit the code to remove interaction w/ app.js. The POST
//    request will only use hard-coded values from this value.
//    No interaction w/ user. On success, console.log("Success")

