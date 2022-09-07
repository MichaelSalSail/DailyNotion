// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, set, child, get} from 'firebase/database';
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

export default fire_app;

// POST to Firebase Realtime
function writeUserQueAns (useremail, allAns, mood, project, template, allQue, ntn_templ) {
  const db = getDatabase();

  // users -> userId -> ...
  const user_ref_1 = ref(db, 'users/' + useremail + '/ques_respon');
  set(user_ref_1, allAns);
  const user_ref_2 = ref(db, 'users/' + useremail + '/daily_mood');
  set(user_ref_2, mood);
  const user_ref_3 = ref(db, 'users/' + useremail + '/project');
  set(user_ref_3, project);
  const user_ref_4 = ref(db, 'users/' + useremail + '/template');
  set(user_ref_4, template);

  // references -> ...
  const rsrc_ref_1 = ref(db, 'references/questionnaire');
  set(rsrc_ref_1, allQue);
  const rsrc_ref_2 = ref(db, 'references/templates');
  set(rsrc_ref_2, ntn_templ);
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
  date_08_30_2022: 1
}
// 3. User must submit project dates and associated tokens.
//    Our API can now track the project page during these dates.
const project_space={
  tokens: {
    intgr_token: "Internal_Integration_token_value",
    page_token: "Database_token_value"
  },
  timeline: {
    start_date: "09/07/2022",
    end_date: "10/06/2022"
  },
  // We need to automate API calls.
  // Idk how we're going to do it, but it sounds exciting!
  api_resp: {
    // I'm thinking we schedule API calls daily at 11:59PM everyday.
    date_08_30_2022: {
      last_edit: "17:08:00 GMT-0400 (Eastern Daylight Time)"
    }
  }
}
// 4. User must create a copy of our template in their workspace. 
//    User must submit associated tokens.
//    Our API can now track the template page during these dates.
const template_space={
  tokens: {
    intgr_token: "Internal_Integration_token_value",
    page_token: "Database_token_value"
  },
  api_resp: {
    days: {
      date_08_30_2022: {
        // probably not as important as for the project page, but who knows
        // I'm thinking we schedule API calls daily at 11:59PM everyday.
        last_edit: "21:21:00 GMT-0400 (Eastern Daylight Time)"
      }
    },
    weeks: {
      end_week_1: {
        // If exactly one week has passed since template tokens submitted, 
        // or since our last API calls, do the following:
        // First, make a GET request to view all entries from the current week.
        // Count the entries that are NOT blank.
        // Value should range from 0-4 since each template only has 4 columns.
        cells_complete: 4
        // Last, we make an API POST request to add another row to the database
        // so the user can write entries for the next week.
      }
    }
  }
}

writeUserQueAns("michaelsalamon78", exmpl_answ, exmpl_mood, project_space, template_space, exmpl_ques, ntn_links);

// GET to Firebase Realtime
const dbRef = ref(getDatabase());
get(child(dbRef, `users`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});