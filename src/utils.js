/**
 * Converts date object to MM_DD_YYYY format
 * @param {Date object} dateObj - current date and time
 * @return {string} - appropriate Firebase Realtime node name
 */
 export function nodeDate(dateObj = new Date()) {
    // values 0 through 11 represent months, add 1
    let month=dateObj.getMonth()+1;
    if(month<10)
        month="0"+String(month);
    let day=String(dateObj.getDate());
    if(day<10)
        day="0"+String(day);
    let year=String(dateObj.getFullYear());
    const result="date_"+month+"_"+day+"_"+year;
    return result;
};

/**
 * Returns recent feedback.node the app should extracts msgs from
 * @param {Date object} dateObj - current date and time
 * @return {string} - matching Firebase Realtime node name
 */
 export function nodeRecent(dateObj = new Date()) {
    const current_hr=dateObj.getHours();
    // if b4 10PM, get the node for yesterdays date
    if(current_hr<22)
    {
        const yesterday=new Date();
        yesterday.setYear(dateObj.getFullYear());
        yesterday.setMonth(dateObj.getMonth());
        yesterday.setDate(dateObj.getDate() - 1);
        return nodeDate(yesterday);
    }
    // if after 10PM, use todays date
    else
        return nodeDate();
};