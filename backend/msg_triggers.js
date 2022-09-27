const utils = require('./utils.js');

//                                          GENERAL

/**
 * 1. A week passed and didn't write to template.
 * @param {json} get_proj - Notion API GET response
 * @return {boolean} - did the user fail to edit their Notion template database this past week?
 */
const templ_inactive_week = (get_templ) => {
    const today = new Date();
    // const node_2day= utils.nodeDate();
    let last_edit=get_templ.db_last_edit_time;
    let date_edit=new Date(last_edit);
    // parse() converts Date to milliseconds since Jan 1970
    // There are 604800000 milliseconds in a week
    if(Math.abs(Date.parse(date_edit)-Date.parse(today))>=604800000)
    {
        console.log("1. Difference is in range:",Math.abs(Date.parse(date_edit)-Date.parse(today)));
        return true;
    }
    else
    {
        // 86400000 ms in a day
        console.log("1. Difference is just",(Math.abs(Date.parse(date_edit)-Date.parse(today))/86400000).toFixed(2),"days");
        return false;
    }
}

/**
 * 2. A week passed and didn't write to project page.
 * @param {json} get_proj - Notion API GET response
 * @return {boolean} - did the user fail to edit their Notion project page this past week?
 */
const proj_inactive_week = (get_proj) => {
    const today = new Date();
    last_edit=get_proj.pg_last_edit_time;
    date_edit=new Date(last_edit);
    if(Math.abs(Date.parse(date_edit)-Date.parse(today))>=604800000)
    {
        console.log("2. Difference is in range:",Math.abs(Date.parse(date_edit)-Date.parse(today)));
        return true;
    }
    else
    {
        console.log("2. Difference is just",(Math.abs(Date.parse(date_edit)-Date.parse(today))/86400000).toFixed(2),"days");
        return false;
    }
}

/**
 * 3. Tracked mood for 7 days in a row.
 * @param {json} user_tree - all data associated w/ a particular user
 * @return {boolean} - did the user input their mood these past 7 days?
 */
const mood_streak7 = (user_tree) => {
    let node_day_b4=utils.nodeDate();
    let day_b4=new Date();
    for(let i=7;i>0;i--)
    {
        // if the date_node doesn't exist under daily_mood for a particular day,
        // the streak is broken.
        if(user_tree.daily_mood[node_day_b4] === undefined)
        {
            console.log("3. mood_streak7 is", false, "since", node_day_b4);
            return false;
        }
        else
        {
            // create a date object that goes back one day
            day_b4.setDate(day_b4.getDate() - 1);
            // store the equivalent node name
            node_day_b4=utils.nodeDate(day_b4);
        }
    }
    console.log("3. mood_streak7 is", true, "since", node_day_b4);
    return true;
}

/**
 * 4. Mood is happy for 3 days in a row.
 * @param {json} user_tree - all data associated w/ a particular user
 * @return {boolean} - was the mood happy for the past 3 days?
 */
const mood_h_streak3 = (user_tree) => {
    let node_day_b4=utils.nodeDate();
    let day_b4=new Date();
    for(let i=3;i>0;i--)
    {
        // If the mood value is not happy, not 4 or 5, the streak is broken.
        if(user_tree.daily_mood[node_day_b4] === undefined || user_tree.daily_mood[node_day_b4] <= 3)
        {
            console.log("4. mood_streak3 is", false, "since", node_day_b4);
            return false;
        }
        else
        {
            // create a date object that goes back one day
            day_b4.setDate(day_b4.getDate() - 1);
            // store the equivalent node name
            node_day_b4=utils.nodeDate(day_b4);
        }
    }
    console.log("4. mood_streak3 is", true, "since", node_day_b4);
    return true;
}

//                                          SPECIFIC
// Overwork (burnout)
// 5. Worked 7 days last week.
const burnout7 = (user_tree) => {
    // this function is only for overwork users!
    if(user_tree.ques_respon.answ_1!=="Overwork (burnout)")
    {
        console.log("5. burnout7 is", false, "since wrong user-type");
        return false;
    }
    else
    {
        let node_day_b4=utils.nodeDate();
        let day_b4=new Date();
        for(let i=7;i>0;i--)
        {
            if(user_tree.project.api_resp[node_day_b4] === undefined)
            {
                console.log("5. burnout7 is", false, "since", node_day_b4);
                return false;
            }
            else
            {
                let edit_date=new Date(user_tree.project.api_resp[node_day_b4].getProject.pg_last_edit_time);
                if(day_b4.getFullYear()!==edit_date.getFullYear() || 
                   day_b4.getMonth()!==edit_date.getMonth() ||
                   day_b4.getDate()!==edit_date.getDate())
                {
                    console.log("5. burnout7 is", false, "since", node_day_b4);
                    return false;
                }
            }
            // create a date object that goes back one day
            day_b4.setDate(day_b4.getDate() - 1);
            // store the equivalent node name
            node_day_b4=utils.nodeDate(day_b4);
        }
        // if there exists date_nodes AND the last_edit_times match the current day
        console.log("5. burnout7 is", true, "since", node_day_b4);
        return true;
    }
}

// Procrastination
// 6. Worked during a day you tend to be less productive.
// 7. Didn't work for a day you tend to be productive.

// Excessive Negative Thinking
// 8. Mood is not happy for 3 days in a row but also productive.
// 9. Mood is not happy for 3 days in a row but also unproductive.
// 10. A majority of days last week the user was productive.

// Export functions for use in feedback_cron.js
module.exports= {
    templ_inactive_week: templ_inactive_week,
    proj_inactive_week: proj_inactive_week,
    mood_streak7: mood_streak7,
    mood_h_streak3: mood_h_streak3,
    burnout7: burnout7
}