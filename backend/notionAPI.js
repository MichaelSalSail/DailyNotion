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

// helper function for updateTemplate
const entriesTempl = (user_type, week) => {
    // All 4 curated Notion template questions
    const positivity=[String(week),
                      "What is 1 thing you are grateful for today?",
                      "What is your most recent success? How proud are you from a scale of 1-10?",
                      "What excites you about your current project?",
                      "Write down 1 reason you should feel confident working on your project this week."]
    const balance=[String(week),
                   "How stressed are you from a scale of 1-10? Explain.",
                   "What stressors can you remove from your routine this week?",
                   "Working smarter > working harder. Think of ways you can work more efficient.",
                   "Do you think your workload is sustainable? Should you be taking more breaks?"]
    const task_log=[String(week),
                    "Think back to the last time you procrastinated. What was the task and why did you procrastinate?",
                    "What is the simplest task you can perform this week to make progress on your project?",
                    "When is the earliest you can start?",
                    "Are you feeling confident doing this task at this time frame? Why or why not?"]
    const goal_set=[String(week),
                    "What was your most recent goal you failed to complete?",
                    "Write 3 goals you have atm. Rank them from most interesting to least interesting.",
                    "Do you think you can stick w/ your first goal? Can you make it more interesting?",
                    "If you find yourself goal switching, what can you do to stay on track?"]
    if(user_type==="Overwork (burnout)")
        return balance;
    else if(user_type==="Procrastination")
        return task_log;
    else if(user_type==="Excessive Negative Thinking")
        return positivity;
    else if(user_type==="Excessive Task Switching")
        return goal_set;
    else
        return [String(week),"???","???","???","???"];
};

// Export functions to run in feedback_cron.js
module.exports= {
    getTemplate: getTemplate,
    updateTemplate: updateTemplate,
    getProject: getProject,
    msgProject: msgProject,
    entriesTempl: entriesTempl
}