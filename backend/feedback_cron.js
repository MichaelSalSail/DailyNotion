const { Client } = require('@notionhq/client');
const notionAPI = require('./notionAPI.js');
const triggers = require('./msg_triggers.js');
const utils = require('./utils.js');
const cron = require('node-cron');
// firebase-admin setup
let admin = require("firebase-admin");
let serviceAccount = require("./fire_admin_cred.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.primary),
  databaseURL: serviceAccount.databaseURL
});

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


// POST the notion GET responses and msgs to database
const msgsPOST = async (current_user,notionGET,user,ref) => {
  console.log("In realtimeGetPost!");
  console.log("The name of project page is",notionGET.get_proj.pg_name);
  console.log("The name of template database is",notionGET.get_templ.db_name);

  // set-up necessary properties
  current_user.project.api_resp[utils.nodeDate()]={"getProject":notionGET.get_proj,"msgProject":{}};
  current_user.template.api_resp[utils.nodeDate()]={"getTemplate":notionGET.get_templ,"updateTemplate":{}};
  current_user.feedback[utils.nodeDate()]={};
  // General+Specific trigger function results
  const all_triggers=[triggers.templ_inactive_week(current_user.template.api_resp[utils.nodeDate()].getTemplate),
  triggers.proj_inactive_week(current_user.project.api_resp[utils.nodeDate()].getProject),
  triggers.mood_streak7(current_user),
  triggers.mood_h_streak3(current_user),
  triggers.burnout7(current_user),
  triggers.workedOffDay(current_user),
  triggers.noworkOnDay(current_user),
  triggers.lowmood3_pro(current_user),
  triggers.lowmood3_nopro(current_user),
  triggers.cnstnt_prod(current_user)];
  // Associated msgs
  let feedback={};
  let count=0;
  let comment_count=0;
  // retieve notion project tokens for POST call.
  const projIntgr = new Client({ auth : current_user.project.tokens.intgr_token});
  const projId = current_user.project.tokens.page_token;
  for(i=0;i<all_triggers.length;i++)
  {
    if(all_triggers[i]===true)
    {
      count++;
      let curr_name="msg_"+String(count);
      feedback[curr_name]={};
      feedback[curr_name].text=msgs.text[i];
      feedback[curr_name].color=msgs.color[i];
      // Write the msg as a comment to project page
      // NOTE: There appears to be a limit to the amount of comments that
      // can be written in a short period of time. It appears to be max. 1.
      if(count===1)
      {
        notionAPI.msgProject(projIntgr,projId,feedback[curr_name].text).then(()=>{console.log("Comment POST success.")});
        comment_count++;
      }
    }
  }
  // instead of updating Realtime w/ all Notion POST responses for msgProject(),
  // only update w/ the number of submitted comments.
  current_user.project.api_resp[utils.nodeDate()].msgProject={"total_cmnts": comment_count};
  console.log(feedback);
  current_user.feedback[utils.nodeDate()]=feedback;
  // POST everything under 'users/user'
  const exampleRef = ref.child(user);
  exampleRef.set(current_user);
};

// perform both Notion API GET requests and return a json containing both
// then, call msgsPOST()
const notionGET = async (curr_user_tree, user, ref) => {
  // Access template page
  const templateIntgr = new Client({ auth : curr_user_tree.template.tokens.intgr_token});
  const templateId = curr_user_tree.template.tokens.page_token;
  // Access project page
  const projIntgr = new Client({ auth : curr_user_tree.project.tokens.intgr_token});
  const projId = curr_user_tree.project.tokens.page_token;
  notionAPI.getProject(projIntgr,projId).then(get_proj => {
    notionAPI.getTemplate(templateIntgr,templateId).then(get_templ => {
      msgsPOST(curr_user_tree,{get_templ: get_templ, get_proj: get_proj}, user, ref);
    });
  });
};

// obtain json of all users and iterate through each in a loop
// then, call notionGET()
const daily_usersGET = async () => {
  // setup before GET
  const db = admin.database();
  const path="users";
  let ref = db.ref(path);
  let example_users_tree={};
  ref.once("value", function(snapshot) {
    // GET everything under 'users'
    example_users_tree=snapshot.val();
    for(user in example_users_tree)
    {
      console.log(user);
      if(user!=="example_1")
      {
        console.log("PROCEED");
        notionGET(example_users_tree[user], user, ref);
      }
      else
      {
        console.log("GO NEXT");
        continue;
      }
    }
  });
};

// perform Notion API POST request for template page and 
// update Firebase Realtime w/ json response.
const notionPOST = async (curr_user_tree, user, ref, add_entry) => {
  // Access template page
  const templateIntgr = new Client({ auth : curr_user_tree.template.tokens.intgr_token});
  const templateId = curr_user_tree.template.tokens.page_token;
  if(add_entry===true)
  {
    curr_user_tree.week+=1;
    notionAPI.updateTemplate(templateIntgr,templateId,notionAPI.entriesTempl(curr_user_tree.ques_respon.answ_1,curr_user_tree.week)).then(response => {
      curr_user_tree.template.api_resp[utils.nodeDate()].updateTemplate=response;
      // POST under 'users/user'
      const exampleRef = ref.child(user);
      exampleRef.set(curr_user_tree);
    });
  }
  // set the week value to 1, this is the only week an entry isn't added since
  // they copied our template and which already has the first row.
  else
  {
    curr_user_tree.week=1;
    // POST under 'users/user'
    const exampleRef = ref.child(user);
    exampleRef.set(curr_user_tree);
  }
};

// obtain json of all users and iterate through each in a loop
// to call notionPOST()
const weekly_usersGET = async () => {
  // setup before GET
  const db = admin.database();
  const path="users";
  let ref = db.ref(path);
  let example_users_tree={};
  ref.once("value", function(snapshot) {
    // GET everything under 'users'
    example_users_tree=snapshot.val();
    for(user in example_users_tree)
    {
      console.log(user);
      if(user!=="example_1")
      {
        // if 'week' node already exists, it is not the first week so add an entry.
        // otherwise, it is the first week so just initialize the property in
        // Firebase Realtime. the template Notion link I shared under 'resources'
        // already has an entry for week 1.
        console.log("PROCEED");
        notionPOST(example_users_tree[user], user, ref, example_users_tree[user].week!==undefined);
      }
      else
      {
        console.log("GO NEXT");
        continue;
      }
    }
  });
};

// create valid node-cron expressions
let daily="0 22 * * *";
let weekly="2 22 * * Sun";
console.log(cron.validate(daily),cron.validate(weekly));

// daily
cron.schedule(daily, function() {
  daily_usersGET();
});

// weekly
cron.schedule(weekly, function() {
  weekly_usersGET();
});