// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, onValue, set, child, get} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const get_fire_cred=require('./fire_cred.js');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: get_fire_cred.api,
  authDomain: get_fire_cred.dom,
  projectId: get_fire_cred.projId,
  storageBucket: get_fire_cred.bucket,
  messagingSenderId: get_fire_cred.senderId,
  appId: get_fire_cred.appId,
  measurementId: get_fire_cred.msrmentId
};

// Initialize Firebase
const fire_app = initializeApp(firebaseConfig);

// POST references under 'references' node on Firebase Realtime
function writeRefrnces(refr_info) {
  const db = getDatabase();
  // references -> ...
  const rsrc_ref_1 = ref(db, 'references/questionnaire');
  set(rsrc_ref_1, refr_info["references"]["questionnaire"]);
  const rsrc_ref_2 = ref(db, 'references/templates');
  set(rsrc_ref_2, refr_info["references"]["templates"]);
}

// POST user data under 'users' node on Firebase Realtime
function writeUserInfo(user_info) {
  const db = getDatabase();
  let user_id=Object.getOwnPropertyNames(user_info)[0]
  let num_user_props=Object.getOwnPropertyNames(user_info[user_id]).length
  for(let i=0; i<num_user_props; i++)
  {
    let current=Object.getOwnPropertyNames(user_info[user_id])[i]
    // users -> userId -> ...
    const user_ref = ref(db, 'users/' + user_id + '/' + current);
    set(user_ref, user_info[user_id][current]);
  }
}

// GET question+response data on user user_id through Firebase Realtime
function read_que_ans(user_id) {
  const db = getDatabase();
  onValue(ref(db), (snapshot) => {
    console.log("User:", user_id);
    for(let i=1; i<7; i++)
    {
      console.log("Q"+String(i)+". ",snapshot.val()["references"]["questionnaire"]["ques_"+String(i)]["que"]);
      console.log("A"+String(i)+". ",snapshot.val()["users"][user_id]["ques_respon"]["answ_"+String(i)]);
    }
  });
}

// Call this function upon successful user registration
function set_new_user(user_json, user_email) {
  // sanitize user_email to become user_id.
  // user_id must be a valid Firebase Realtime node name.
  // replace the @ and . chars w/ underscores.
  let reg_exp=/[@.]/g;
  const user_id=user_email.replaceAll(reg_exp,"_");
  // rename user 'example' to user_id
  user_json[user_id] = user_json["example"];
  delete user_json["example"];
  // POST to repo
  writeUserInfo(user_json);
}

// Option Menus for Questionnaire
// aka: associated mental conditions [common issue, adhd, depression, anxiety]
const prod_problms=["Procrastination",
                    "Excessive Task Switching (starting but never finishing)", 
                    "Excessive Negative Thinking",
                    "Overwork (burnout)"]
const orgnz_skills=["Terrible","Less than Avg","Avg","Great","Perfect"]
const days_of_week=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const times_of_day=["Early Morning (6AM-9AM)", "Late Morning (9AM-12PM)", 
                    "Early Afternoon (12PM-3PM)", "Late Afternoon (3PM-6PM)", 
                    "Early Evening (6PM-9PM)","Late Evening (9PM-12AM)",
                    "Night (12AM-5AM)"]


// REFERENCES
// 1. Questionnaire
const exmpl_ques={
  ques_1: {
    // question and options
    que : "What is your most common productivity hurdle?",
    opt : prod_problms
  },
  ques_2: {
    que : "How would you describe your organizational ability?",
    opt : orgnz_skills
  },
  ques_3: {
    que : "Which days of the week are you most productive? (max. 3)",
    opt : days_of_week
  },
  ques_4: {
    que : "Which times of day are you most productive? (max. 3)",
    opt : times_of_day
  },
  ques_5: {
    que : "Which days of the week are you least productive? (max. 3)",
    opt : days_of_week
  },
  ques_6: {
    que : "Which times of day are you least productive? (max. 3)",
    opt : times_of_day
  }
}
// 2. Notion Links
// Each template is to tackle each of the 4 productivity problems
const ntn_links={
  anti_procr: "https://giant-hammer-3aa.notion.site/Task-Logger-cf6395172d524fa38a05cf2f29958657",
  anti_switc: "https://giant-hammer-3aa.notion.site/Goal-Setting-aa154c07dd0b48af891907181acf1133",
  anti_ngtve: "https://giant-hammer-3aa.notion.site/Positivity-7e72ad86fd494f759d521ea0bd3aff34",
  anti_ovrwk: "https://giant-hammer-3aa.notion.site/Balance-8a5826b3236d4fec9f300d140dd169c8"
}
// putting everything together
let refrnces_all={
  references: {
    questionnaire: exmpl_ques,
    templates: ntn_links
  }
}
// only needs to be called once but watev
writeRefrnces(refrnces_all);

// USERS
// 1. Questionnaire responses
const exmpl_answ={
  answ_1: prod_problms[3], // "Overwork (burnout)",
  answ_2: orgnz_skills[3], // "Great",
  answ_3: [days_of_week[1], days_of_week[3], days_of_week[5]], // ["Mon, Wed, and Fri"],
  answ_4: [times_of_day[2], times_of_day[4]], // ["Early Afternoon", "Early Evening"],
  answ_5: [days_of_week[0], days_of_week[6]], // ["Sun", "Sat"],
  answ_6: [times_of_day[0], times_of_day[6]] // ["Early Morning", "Night"]
}
// 2. Daily Mood
const exmpl_mood={
  // todays_date: scale of 1 to 5 (1 is sad, 5 is happy)
  date_09_30_2022: 1
}
// 3. User must submit project dates and associated tokens.
//    Our API can now track the project page during these dates.
const project_space={
  "api_resp": {
    "date_09_30_2022": {
      "getProject": {pg_last_edit_time:'Thu Sep 29 2022 12:02:00 GMT-0400 (Eastern Daylight Time)'},
      "msgProject": {
        object: 'comment',
        created_time: 'Tue Sep 27 2022 12:12:00 GMT-0400 (Eastern Daylight Time)',
        content: "You're doing great! Keep it up."
      }
    }
  },
  "tokens": {
    "intgr_token": "Internal_Integration_token_value",
    "page_token": "Database_token_value"
  }
}
// 4. User must create a copy of our template in their workspace. 
//    User must submit associated tokens.
//    Our API can now track the template page during these dates.
const template_space={
  "api_resp": {
    "date_09_30_2022": {
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
}
// 5. feedback
// msgs and associated colors that should be displayed
// through our app under a particular date
let exmpl_fdbk= {
  date_09_30_2022: {
    msg_1: { text: "You're frequently tracking your mood. Excellent work!", color: "green" },
    msg_2: { text: "Recently, you've been feeling great! Use this to your advantage, get work done!", color: "green" },
    msg_3: { text: "You worked all of last week! Try and schedule at least 1 day a week to no work.", color: "red" }
  }
}


// everything together
let example_all={
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
}
writeUserInfo(example_all);

// user "example" is a dummy example
read_que_ans("example");

// make a blank template for new users
let user_skeleton= {
  "example": {
    "daily_mood": {},
    "project": {
      "api_resp": {},
      "tokens": {
        "intgr_token": "Internal_Integration_token_value",
        "page_token": "Database_token_value"
      }
    },
    "ques_respon": {
      "answ_1": "",
      "answ_2": "",
      "answ_3": [],
      "answ_4": [],
      "answ_5": [],
      "answ_6": []
    },
    "template": {
      "api_resp": {},
      "tokens": {
        "intgr_token": "Internal_Integration_token_value",
        "page_token": "Database_token_value"
      }
    },
    "feedback": {}
  }
}

let fireDB = {
  fire_app: fire_app,
  user_skeleton: user_skeleton,
  set_new_user: set_new_user
};

export default fireDB;
