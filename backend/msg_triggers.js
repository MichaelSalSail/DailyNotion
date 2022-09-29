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
    let last_edit=get_proj.pg_last_edit_time;
    let date_edit=new Date(last_edit);
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
        console.log("5. burnout7 is", false, "b/c user is not overwork.");
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
const workedOffDay = (user_tree) => {
    // this function is only for procrastination users!
    if(user_tree.ques_respon.answ_1!=="Procrastination")
    {
        console.log("6. workedOffDay is", false, "b/c user is not procrastination.");
        return false;
    }
    else
    {
        // ques_3: Which days of the week are you most productive? (max. 3)
        // ques_5: Which days of the week are you least productive? (max. 3)
        let on_days=user_tree.ques_respon.answ_3;
        let off_days=user_tree.ques_respon.answ_5;
        // Not sure if user answers from Firebase Realtime will be strings or numbers.
        // Either way, here's how to read it. Each index is day of week except index 0.
        const equivalent= ["N/A","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        // convert from numbers to equivalent string
        if(typeof(on_days[0])==='number')
        {
            for(let i=0;i<on_days.length;i++)
                on_days[i]=equivalent[on_days[i]];
        }
        if(typeof(off_days[0])==='number')
        {
            for(let i=0;i<off_days.length;i++)
                off_days[i]=equivalent[off_days[i]];
        }
        // Did the user put in similar days for opposite questions?
        // If so, we have to ignore those inputs.
        const upd_days=utils.rmve_overlap(on_days,off_days);
        on_days=upd_days[0];
        off_days=upd_days[1];
        // get the day of week for recent last_edit
        const today = new Date();
        let last_edit=user_tree.project.api_resp[utils.nodeDate()].getProject.pg_last_edit_time;
        let date_edit=new Date(last_edit);
        let day_of_edit=equivalent[date_edit.getDay()+1];
        // if there was an edit today and the day_of_edit was in off_days, return true
        if(today.getFullYear()===date_edit.getFullYear() && today.getMonth()===date_edit.getMonth() &&
            today.getDate()===date_edit.getDate())
        {
            if(off_days.includes(day_of_edit))
            {
                console.log("6. workedOffDay is", true);
                return true;
            }
        }
        console.log("6. workedOffDay is", false);
        return false;
    }
};

// Procrastination
// 7. Didn't work for a day you tend to be productive.
const noworkOnDay = (user_tree) => {
    // this function is only for procrastination users!
    if(user_tree.ques_respon.answ_1!=="Procrastination")
    {
        console.log("7. noworkOnDay is", false, "b/c user is not procrastination.");
        return false;
    }
    else
    {
        let on_days=user_tree.ques_respon.answ_3;
        let off_days=user_tree.ques_respon.answ_5;
        const equivalent= ["N/A","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        // convert from numbers to equivalent string
        if(typeof(on_days[0])==='number')
        {
            for(let i=0;i<on_days.length;i++)
                on_days[i]=equivalent[on_days[i]];
        }
        if(typeof(off_days[0])==='number')
        {
            for(let i=0;i<off_days.length;i++)
                off_days[i]=equivalent[off_days[i]];
        }
        // Did the user put in similar days for opposite questions?
        // If so, we have to ignore those inputs.
        const upd_days=utils.rmve_overlap(on_days,off_days);
        on_days=upd_days[0];
        off_days=upd_days[1];
        // get the day of week for recent last_edit
        const today = new Date();
        let last_edit=user_tree.project.api_resp[utils.nodeDate()].getProject.pg_last_edit_time;
        let date_edit=new Date(last_edit);
        let day_of_2day=equivalent[today.getDay()+1];
        // if there was NOT an edit today and the day of week for today is in on_days, return true
        if(today.getFullYear()!==date_edit.getFullYear() || today.getMonth()!==date_edit.getMonth() ||
            today.getDate()!==date_edit.getDate())
        {
            if(on_days.includes(day_of_2day))
            {
                console.log("7. noworkOnDay is", true);
                return true;
            }
        }
        console.log("7. noworkOnDay is", false);
        return false;
    }
};

// Excessive Negative Thinking
// 8. Mood is not happy for 3 days in a row but also productive.
const lowmood3_pro = (user_tree) => {
    // this function is only for excessive negative thinking users!
    if(user_tree.ques_respon.answ_1!=="Excessive Negative Thinking")
    {
        console.log("8. lowmood3_pro is", false, "b/c user is not negative thinking.");
        return false;
    }
    else
    {
        let node_day_b4=utils.nodeDate();
        let day_b4=new Date();
        // keep track of number of productive days in streak
        let pro_days=0;
        for(let i=3;i>0;i--)
        {
            // If the mood value is happy, 4 or 5, the streak is broken.
            if(user_tree.daily_mood[node_day_b4] === undefined || user_tree.daily_mood[node_day_b4] > 3)
            {
                console.log("8. lowmood3_pro is", false, "since", node_day_b4);
                return false;
            }
            else
            {
                let last_edit=user_tree.project.api_resp[node_day_b4].getProject.pg_last_edit_time;
                let date_edit=new Date(last_edit);
                if(day_b4.getFullYear()===date_edit.getFullYear() && day_b4.getMonth()===date_edit.getMonth() &&
                day_b4.getDate()===date_edit.getDate())
                {
                    if(user_tree.daily_mood[node_day_b4] <= 3)
                        pro_days++;
                }
                // create a date object that goes back one day
                day_b4.setDate(day_b4.getDate() - 1);
                // store the equivalent node name
                node_day_b4=utils.nodeDate(day_b4);
            }
        }
        if(pro_days>=2)
        {
            console.log("8. lowmood3_pro is", true, "since", node_day_b4);
            return true;
        }
        else
        {
            console.log("8. lowmood3_pro is", false, "since", node_day_b4);
            return false;
        }
    }
};

// Excessive Negative Thinking
// 9. Mood is not happy for 3 days in a row but also unproductive.
const lowmood3_nopro = (user_tree) => {
    // this function is only for excessive negative thinking users!
    if(user_tree.ques_respon.answ_1!=="Excessive Negative Thinking")
    {
        console.log("9. lowmood3_nopro is", false, "b/c user is not negative thinking.");
        return false;
    }
    else
    {
        let node_day_b4=utils.nodeDate();
        let day_b4=new Date();
        // keep track of number of productive days in streak
        let pro_days=0;
        for(let i=3;i>0;i--)
        {
            // If the mood value is happy, 4 or 5, the streak is broken.
            if(user_tree.daily_mood[node_day_b4] === undefined || user_tree.daily_mood[node_day_b4] > 3)
            {
                console.log("9. lowmood3_nopro is", false, "since", node_day_b4);
                return false;
            }
            else
            {
                let last_edit=user_tree.project.api_resp[node_day_b4].getProject.pg_last_edit_time;
                let date_edit=new Date(last_edit);
                if(day_b4.getFullYear()===date_edit.getFullYear() && day_b4.getMonth()===date_edit.getMonth() &&
                day_b4.getDate()===date_edit.getDate())
                {
                    if(user_tree.daily_mood[node_day_b4] <= 3)
                        pro_days++;
                }
                day_b4.setDate(day_b4.getDate() - 1);
                node_day_b4=utils.nodeDate(day_b4);
            }
        }
        if(pro_days<=1)
        {
            console.log("9. lowmood3_nopro is", true, "since", node_day_b4);
            return true;
        }
        else
        {
            console.log("9. lowmood3_nopro is", false, "since", node_day_b4);
            return false;
        }
    }
};

// Excessive Negative Thinking
// 10. A majority of days last week the user was productive.
const cnstnt_prod = (user_tree) => {
    // this function is only for excessive negative thinking users!
    if(user_tree.ques_respon.answ_1!=="Excessive Negative Thinking")
    {
        console.log("10. cnstnt_prod is", false, "b/c user is not negative thinking.");
        return false;
    }
    else
    {
        let node_day_b4=utils.nodeDate();
        let day_b4=new Date();
        // keep track of number of productive days
        let prod_count=0;
        for(let i=7;i>0;i--)
        {
            if(user_tree.project.api_resp[node_day_b4] === undefined)
            {
                console.log("10. cnstnt_prod is", false, "since", node_day_b4);
                return false;
            }
            else
            {
                let date_edit=new Date(user_tree.project.api_resp[node_day_b4].getProject.pg_last_edit_time);
                if(day_b4.getFullYear()===date_edit.getFullYear() && day_b4.getMonth()===date_edit.getMonth() &&
                day_b4.getDate()===date_edit.getDate())
                {
                    prod_count++;
                }
            }
            day_b4.setDate(day_b4.getDate() - 1);
            node_day_b4=utils.nodeDate(day_b4);
        }
        // if less than majority (4 days) the week was productive, return false. Else, return true.
        if(prod_count<4)
        {
            console.log("10. cnstnt_prod is", false, "b/c only", prod_count, "days was productive.");
            return false;
        }
        else
        {
            console.log("10. cnstnt_prod is", true, "since", node_day_b4);
            return true;
        }
    }
};

// Export functions for use in feedback_cron.js
module.exports= {
    templ_inactive_week: templ_inactive_week,
    proj_inactive_week: proj_inactive_week,
    mood_streak7: mood_streak7,
    mood_h_streak3: mood_h_streak3,
    burnout7: burnout7,
    workedOffDay: workedOffDay,
    noworkOnDay: noworkOnDay,
    lowmood3_pro: lowmood3_pro,
    lowmood3_nopro: lowmood3_nopro,
    cnstnt_prod: cnstnt_prod
}