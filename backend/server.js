const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const app = express();

// avoid cors errors
app.use(cors());

const PORT = 4000;
const HOST = "localhost";

// integration token
const client = new Client({ auth : "secret_iZub1ESWahX2NLYwsPqYAiauEqOjAWhThkVpl5CvSnE"});
// database token
const databaseId = "87895127e42d448e9660787419d1c18f";

// POST request
// POST name, phoneNumber, extraInfo
// Functionality: Make a database entry in a Notion page w/ the databaseId above


app.listen(PORT, HOST, () => {
    console.log("Starting proxy at " + HOST + ":" + PORT); // localhost:4000
});

