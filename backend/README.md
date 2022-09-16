# Connect Notion Workspace

The purpose of the backend folder is to interact w/ the Notion JS SDK.  

## Obtaining Credentials  

1. Create a new Notion Workspace for testing.
2. Create a new integration: https://www.notion.so/my-integrations (Select the testing workspace)
3. Under 'Capabilities', make sure to check 'Read comments' and 'Insert Comments' (unchecked by default.)
4. Upon submission, locate the **Internal Integration token_id**. Note this value.
5. Create a new page in your Workspace. Set up an inline table database. Hover over the database 
and click 'Open as full page'.
6. Analyze the unique Notion link associated with this page. It should look something like the example below. Note the value after *notion.so/* but before *?v=*. This is your **page_token**.
>notion.so/a8958c89072c8927e8910271?v=cea289893048a89387c890ee


## Setup
1. Under the selected page in your Workspace, under the Share options, press "Invite" and select your integration. You may use the same, or different, integrations across multiple pages. 
2. The page is now ready for API commands!  

## Next Steps
Create a **notion_tokens.js** file w/ the following format:  
```
module.exports = {
  template: {
    tokens: {
      intgr_token: "Internal_Integration_token_value",
      page_token: "Templ_token_value"
    }
  },
  project: {
    tokens: {
      intgr_token: "Internal_Integration_token_value",
      page_token: "Proj_token_value"
    }
  }
};
```