// const notionAPI = require('./notionAPI.js');
const triggers = require('./msg_triggers.js');

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
let example_user= {
    "users": {
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
          "date_09_27_2022": 5,
          "date_09_28_2022": 4
        },
        "project": {
          "api_resp": {
            "date_09_26_2022": {
                "getProject": { 
                    pg_name: 'Example Project', 
                    pg_init_time: 'Thu Jul 07 2022 14:16:00 GMT-0400 (Eastern Daylight Time)', 
                    pg_last_edit_time: 'Tue Sep 20 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'
  
                },
                "msgProject": { 
                    object: 'comment',
                    created_time: 'Thu Sep 22 2022 23:37:00 GMT-0400 (Eastern Daylight Time)',
                    content: "You're doing great! Keep it up."
                }
            }
          },
          "timeline": {
            "end_date": "10/06/2022",
            "start_date": "09/07/2022"
          },
          "tokens": {
            "intgr_token": "Internal_Integration_token_value",
            "page_token": "Database_token_value"
          }
        },
        "ques_respon": {
          "answ_1": "Overwork (burnout)",
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
            "date_09_26_2022": {
                "getTemplate": {
                    db_name: 'Database Example for DailyNotion', 
                    db_init_time: 'Tue Aug 02 2022 21:21:00 GMT-0400 (Eastern Daylight Time)', 
                    db_last_edit_time: 'Tue Sep 20 2022 23:44:00 GMT-0400 (Eastern Daylight Time)'
                },
                "updateTemplate": {
                    object: 'page',
                    created_time: 'Thu Sep 22 2022 23:37:00 GMT-0400 (Eastern Daylight Time)',
                    parent: {
                    type: 'database_id',
                    database_id: '12903875-e42d-112e-9690-810719d1c18f' 
                    },
                    properties: {
                    'Question 3': { id: 'UOob', type: 'rich_text', rich_text: [Array] },
                    'Question 4': { id: 'tHma', type: 'rich_text', rich_text: [Array] },
                    'Question 2': { id: 'tc~%40', type: 'rich_text', rich_text: [Array] },
                    'Question 1': { id: 'u%7C%3DI', type: 'rich_text', rich_text: [Array] },
                    Week: { id: 'title', type: 'title', title: [Array] }
                    }
                }
            }
          },
          "tokens": {
            "intgr_token": "Internal_Integration_token_value",
            "page_token": "Database_token_value"
          }
        },
        "feedback": {
            "date_09_23_2022": {
                msg_1: {
                    "text": "Keep it up. You're doing great!",
                    "color": "green"
                }
          }
        }
      }
    }
}
/*for(prop in example_user.users.example)
    console.log(prop);*/

// TRIGGERS
                    // CONSTANTS
const msgs=["Please remember to fill out your template! It's important to help overcome your unique productivity hurdles.",
            "You haven't done anything this past week! Fill out the template for this week to reassess what went wrong.",
            "You're frequently tracking your mood. Excellent work!",
            "Recently, you've been feeling great! Use this to your advantage, get work done!",
/*overwork*/"You worked all of last week! Try and schedule at least 1 day a week to no work.",
/*procrast*/"You were productive during an off day! Great work.",
            "You haven't worked for an on day. Try and stick to those days.",
/*negative*/"Even through poor mood you're productive. Impressive!",
            "Go easy on yourself! Don't focus too much on work.",
            "You were productive for most of last week. You show consistant effort!"];
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

const ow_test= {
  "project": {
    "api_resp": {
      "date_09_21_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 21 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_22_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 22 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_23_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 23 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_24_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 24 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_25_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 25 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_26_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 26 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_27_2022": {
          "getProject": {pg_last_edit_time:'Tue Sep 27 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_28_2022": {
        "getProject": {pg_last_edit_time:'Wed Sep 28 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      }
    }
  },
  "ques_respon": {
    "answ_1": "Overwork (burnout)",
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
      "Sat"
    ],
    "answ_6": [
      "Early Morning (6AM-9AM)",
      "Night (12AM-5AM)"
    ]
  }
};

const proc_test= {
  "project": {
    "api_resp": {
      "date_09_26_2022": {
        "getProject": {pg_last_edit_time:'Mon Sep 26 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_27_2022": {
        "getProject": {pg_last_edit_time:'Tue Sep 27 2022 21:37:00 GMT-0400 (Eastern Daylight Time)'}
      },
      "date_09_28_2022": {
        "getProject": {pg_last_edit_time:'Wed Sep 27 2022 12:02:00 GMT-0400 (Eastern Daylight Time)'}
      }
    }
  },
  "ques_respon": {
    "answ_1": "Procrastination",
    "answ_2": "Great",
    "answ_3": [
      "Mon",
      "Wed",
      //"Tue",
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
  }
};

const ngtv_test= {
  "daily_mood": {
    "date_09_19_2022": 1,
    "date_09_20_2022": 3,
    "date_09_21_2022": 1,
    "date_09_22_2022": 1,
    "date_09_23_2022": 3,
    "date_09_24_2022": 2,
    "date_09_25_2022": 4,
    "date_09_26_2022": 3,
    "date_09_27_2022": 3,
    "date_09_28_2022": 3
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
      }
    }
  },
  "ques_respon": {
    "answ_1": "Excessive Negative Thinking",
    "answ_2": "Great",
    "answ_3": [
      "Mon",
      "Wed",
      //"Tue",
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
  }
};

// General trigger function results
const general_triggers=[triggers.templ_inactive_week(get_templ),
                        triggers.proj_inactive_week(get_proj),
                        triggers.mood_streak7(example_user.users.example),
                        triggers.mood_h_streak3(example_user.users.example),
                        triggers.burnout7(ow_test),
                        triggers.workedOffDay(proc_test),
                        triggers.noworkOnDay(proc_test),
                        triggers.lowmood3_pro(ngtv_test),
                        triggers.lowmood3_nopro(ngtv_test),
                        triggers.cnstnt_prod(ngtv_test)];

// Associated msgs
for(i=0;i<general_triggers.length;i++)
{
  if(general_triggers[i]===true)
    feedback.push(msgs[i]);
}
console.log(feedback);