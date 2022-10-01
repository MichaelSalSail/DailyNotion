const { Client } = require('@notionhq/client');
const notionAPI = require('./notionAPI.js');
const triggers = require('./msg_triggers.js');
const utils = require('./utils.js');
const cron = require('node-cron');
const notion_info=require('./notion_tokens.js');

// POST the notion GET responses and msgs to database
const realtimeGetPost = async (msgs, notionGET) => {
  console.log("In realtimeGetPost!");
  console.log("The name of project page is",notionGET.get_proj.pg_name);
  console.log("The name of template database is",notionGET.get_templ.db_name);
  // firebase-admin setup
  let admin = require("firebase-admin");
  let serviceAccount = require("./fire_admin_cred.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount.primary),
    databaseURL: serviceAccount.databaseURL
  });
  // more setup before GET and POST
  const db = admin.database();
  const path="users";
  let ref = db.ref(path);
  let example_users_tree={};
  ref.once("value", function(snapshot) {
    // GET everything under 'users'
    example_users_tree=snapshot.val();
    // set-up necessary properties
    example_users_tree.example_1.project.api_resp[utils.nodeDate()]={"getProject":notionGET.get_proj};
    example_users_tree.example_1.template.api_resp[utils.nodeDate()]={"getTemplate":notionGET.get_templ};
    example_users_tree.example_1.feedback[utils.nodeDate()]={};
    // General+Specific trigger function results
    const all_triggers=[triggers.templ_inactive_week(example_users_tree.example_1.template.api_resp[utils.nodeDate()].getTemplate),
    triggers.proj_inactive_week(example_users_tree.example_1.project.api_resp[utils.nodeDate()].getProject),
    triggers.mood_streak7(example_users_tree.example_1),
    triggers.mood_h_streak3(example_users_tree.example_1),
    triggers.burnout7(example_users_tree.example_1),
    triggers.workedOffDay(example_users_tree.example_1),
    triggers.noworkOnDay(example_users_tree.example_1),
    triggers.lowmood3_pro(example_users_tree.example_1),
    triggers.lowmood3_nopro(example_users_tree.example_1),
    triggers.cnstnt_prod(example_users_tree.example_1)];
    // Associated msgs
    let feedback={};
    let count=0;
    for(i=0;i<all_triggers.length;i++)
    {
      if(all_triggers[i]===true)
      {
        count++;
        let curr_name="msg_"+String(count)
        feedback[curr_name]={};
        feedback[curr_name].text=msgs.text[i];
        feedback[curr_name].color=msgs.color[i];
      }
    }
    console.log(feedback);
    example_users_tree.example_1.feedback[utils.nodeDate()]=feedback;
    // POST everything under 'users/example_1'
    const exampleRef = ref.child('example_1');
    exampleRef.set(example_users_tree.example_1);
  });
};

// perform both Notion API GET requests and return a json containing both
// then, call realtimeGetPost()
const notionGET = async (msgs) => {
  // Access template page
  const templateIntgr = new Client({ auth : notion_info.template.tokens.intgr_token});
  const templateId = notion_info.template.tokens.page_token;
  // Access project page
  const projIntgr = new Client({ auth : notion_info.project.tokens.intgr_token});
  const projId = notion_info.project.tokens.page_token;
  notionAPI.getProject(projIntgr,projId).then(get_proj => {
    notionAPI.getTemplate(templateIntgr,templateId).then(get_templ => {
      realtimeGetPost(msgs,{get_templ: get_templ, get_proj: get_proj});
    });
  });
};

// constants
const msgs_text= [
  "Please remember to fill out your template! It's important to help overcome your unique productivity hurdles.",
  "You haven't done anything this past week! Fill out the template for this week to reassess what went wrong.",
  "You're frequently tracking your mood. Excellent work!",
  "Recently, you've been feeling great! Use this to your advantage, get work done!",
  /*overwork*/
  "You worked all of last week! Try and schedule at least 1 day a week to no work.",
  /*procrast*/
  "You were productive during an off day! Great work.",
  "You haven't worked for an on day. Try and stick to those days.",
  /*negative*/
  "Even through poor mood you're productive. Impressive!",
  "Go easy on yourself! Don't focus too much on work.",
  "You were productive for most of last week. You show consistant effort!"
];
const msgs_color=["red","red","green","green","red","green","yellow","green","blue","green"];
const msgs={"text":msgs_text,"color":msgs_color};

// create valid node-cron expressions
let daily="0 22 * * *";
let weekly="2 22 * * Sun";
console.log(cron.validate(daily),cron.validate(weekly));

// call function
cron.schedule("*/1 * * * *", function() {
  notionGET(msgs);
});



//getUserTree("example");

// const all_users=GET_Firebase_Realtime("users");
// let upd_users=all_users;

// node-cron(daily, "10PM EST") {
  // for(user in users) {
    // const templateIntgr = new Client({ auth : notion_info.template.tokens.intgr_token});
    // const templateId = notion_info.template.tokens.page_token;
    // const projIntgr = new Client({ auth : notion_info.project.tokens.intgr_token});
    // const projId = notion_info.project.tokens.page_token;
    // upd_users[user].project.api_resp[nodeDate()]={"getProject":{},"msgProject":{}};
    // upd_users[user].template.api_resp[nodeDate()]={"getTemplate":{},"updateTemplate":{}};
    // 
    // get_templ = notionAPI.getTemplate(templateIntgr,templateId);
    // get_proj = notionAPI.getProject(projIntgr,projId);
    // upd_users[user].template.api_resp[nodeDate()].getTemplate = get_templ;
    // upd_users[user].project.api_resp[nodeDate()].getProject = get_proj;
    // let all_msgs={};
    // let date_today=utils.nodeDate();
    // all_msgs[date_today]={};
    // const msgs_enum=["msg_1","msg_2","msg_3"];
    // const msgs_content=["Youre doing gr8!","Keep it up!","Dont get discouraged."];
    // const msgs_color=["blue","red","green"];
    // let msg_proj={};
    // for(i in msgs_enum) {
      // all_msgs[date_today][msgs_enum[i]]={"text":msgs_content[i],"color":msgs_color[i]};
      // msg_proj[msgs_enum[i]] = notionAPI.msgProject(projIntgr,projId,msgs_content[i]);
    // }
    // upd_users[user].feedback[nodeDate()] = all_msgs[nodeDate()];
    // upd_users[user].project.api_resp[nodeDate()].msgProject=msg_proj;
  // }
// };

// node-cron(weekly, "Sun 10:01PM EST") {
  // const templateIntgr = new Client({ auth : notion_info.template.tokens.intgr_token});
  // const templateId = notion_info.template.tokens.page_token;
  // const projIntgr = new Client({ auth : notion_info.project.tokens.intgr_token});
  // const projId = notion_info.project.tokens.page_token;
  // if(upd_users[user].template.api_resp[nodeDate()]===undefined)
    // upd_users[user].template.api_resp[nodeDate()]={"getTemplate":{},"updateTemplate":{}};

  // for(user in users) {
    // if(upd_users[user].week===undefined)
      // upd_users[user].week=1;
    // else {
      // entriesTempl
      // upd_templ = notionAPI.updateTemplate(templateIntgr,templateId,entriesTempl(upd_users[user].ques_respon.answ_1,upd_users[user].week+1));
      // upd_users[user].template.api_resp[nodeDate()].updateTemplate=upd_templ;
      // upd_users[user].week+=1;
  // }
// };

// POST_Firebase_Realtime("users",upd_users);

// This is an example
// lets assume right before node-cron runs on date_09_24_2022,
// this is the data extracted from one of the users.
// boolean statements will use the keys from this json

//let example_users_tree= getUsersTree();
/*{
  "example": {
    "daily_mood": {
      "date_09_19_2022": 1,
      "date_09_20_2022": 3,
      "date_09_21_2022": 1,
      "date_09_22_2022": 1,
      "date_09_23_2022": 3,
      "date_09_24_2022": 2,
      "date_09_25_2022": 4,
      "date_09_26_2022": 5,
      "date_09_27_2022": 3,
      "date_09_28_2022": 2,
      "date_09_29_2022": 1,
      "date_09_30_2022": 3
    },
    "project": {
      "api_resp": {
          "date_09_22_2022": {
            "getProject": {pg_last_edit_time:'Thu Sep 22 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_23_2022": {
            "getProject": {pg_last_edit_time:'Fri Sep 23 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_24_2022": {
            "getProject": {pg_last_edit_time:'Sat Sep 24 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_25_2022": {
            "getProject": {pg_last_edit_time:'Sun Sep 25 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_26_2022": {
            "getProject": {pg_last_edit_time:'Sun Sep 25 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_27_2022": {
            "getProject": {pg_last_edit_time:'Sat Sep 24 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_28_2022": {
            "getProject": {pg_last_edit_time:'Thu Sep 22 2022 12:02:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_29_2022": {
            "getProject": {pg_last_edit_time:'Fri Sep 23 2022 12:02:00 GMT-0400 (Eastern Daylight Time)'}
          },
          "date_09_30_2022": {
            "getProject": {pg_last_edit_time:'Thu Sep 29 2022 12:02:00 GMT-0400 (Eastern Daylight Time)'}
          }
      },
      "tokens": {
        "intgr_token": "Internal_Integration_token_value",
        "page_token": "Database_token_value"
      }
    },
    "ques_respon": {
      "answ_1": "Excessive Negative Thinking",
      "answ_2": "Great",
      "answ_3": [
        "Mon",
        "Wed",
        "Fri"
      ],
      "answ_4": [
        "Early Afternoon (12PM-3PM)",
        "Early Evening (6PM-9PM)"
      ],
      "answ_5": [
        "Sun",
        "Tue",
        "Sat"
      ],
      "answ_6": [
        "Early Morning (6AM-9AM)",
        "Night (12AM-5AM)"
      ]
    },
    "template": {
      "api_resp": {
        "date_09_30_2022": {
            "getTemplate": {
                db_name: 'Database Example for DailyNotion', 
                db_init_time: 'Tue Aug 02 2022 21:21:00 GMT-0400 (Eastern Daylight Time)', 
                db_last_edit_time: 'Tue Sep 20 2022 23:44:00 GMT-0400 (Eastern Daylight Time)'
            },
            "updateTemplate": {
                object: 'page',
                created_time: 'Thu Sep 22 2022 23:37:00 GMT-0400 (Eastern Daylight Time)'
            }
        }
      },
      "tokens": {
        "intgr_token": "Internal_Integration_token_value",
        "page_token": "Database_token_value"
      }
    },
    "feedback": {
        "date_09_30_2022": {
            msg_1: {
                "text": "Keep it up. You're doing great!",
                "color": "green"
            }
      }
    }
  }
}*/
/*for(prop in example_user.users.example)
    console.log(prop);*/

// TRIGGERS
                    // CONSTANTS

const feedback=[];
const get_templ= {
  db_name: 'Database Example for DailyNotion',
  db_init_time: 'Tue Aug 02 2022 21:21:00 GMT-0400 (Eastern Daylight Time)',
  db_last_edit_time: 'Tue Sep 20 2022 23:44:00 GMT-0400 (Eastern Daylight Time)'
};
const get_proj= {
  pg_name: 'Example Project',
  pg_init_time: 'Thu Jul 07 2022 14:16:00 GMT-0400 (Eastern Daylight Time)',
  pg_last_edit_time: 'Tue Sep 20 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'
};

// General+Specific trigger function results
/*const all_triggers=[triggers.templ_inactive_week(example_users_tree.example.template.api_resp[utils.nodeDate()].getTemplate),
                        triggers.proj_inactive_week(example_users_tree.example.project.api_resp[utils.nodeDate()].getProject),
                        triggers.mood_streak7(example_users_tree.example),
                        triggers.mood_h_streak3(example_users_tree.example),
                        triggers.burnout7(example_users_tree.example),
                        triggers.workedOffDay(example_users_tree.example),
                        triggers.noworkOnDay(example_users_tree.example),
                        triggers.lowmood3_pro(example_users_tree.example),
                        triggers.lowmood3_nopro(example_users_tree.example),
                        triggers.cnstnt_prod(example_users_tree.example)];

// Associated msgs
for(i=0;i<all_triggers.length;i++)
{
  if(all_triggers[i]===true)
    feedback.push(msgs[i]);
}
console.log(feedback);*/