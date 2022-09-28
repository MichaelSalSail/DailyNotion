/**
 * Converts date object to MM_DD_YYYY format
 * @param {Date object} dateObj - current date and time
 * @return {string} - appropriate Firebase Realtime node name
 */
const nodeDate = (dateObj = new Date()) => {
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
const nodeRecent = (dateObj = new Date()) => {
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

/**
 * Returns 2 arrays that DO NOT share similar elements.
 * @param {array} array1 - all elements are unique! They're either all strings or all ints.
 * @param {array} array2 - same as above. Elements are matching type as array1.
 * @return {array} - [array1, array2]
 */
 const rmve_overlap = (array1, array2) => {
    let both_arr=array1.concat(array2);
    const both_set=new Set(both_arr);
    // If the same size, all unique elements. We're done.
    if(both_arr.length===both_set.size)
        return [array1, array2];
    else
    {
        // delete any similar elements
        let upd_array1=array1;
        let upd_array2=array2;
        for(const item of both_set)
        {
            let to_replace={};
            for(let a=0;a<array1.length;a++)
            {
                if(array1[a]===item)
                {
                    to_replace["array1"]=a;
                    break;
                }
            }
            for(let b=0;b<array2.length;b++)
            {
                if(array2[b]===item)
                {
                    to_replace["array2"]=b;
                    break;
                }
            }
            if(to_replace["array1"]!==undefined && to_replace["array2"]!==undefined)
            {
                // delete the first occurence specified at the given index
                upd_array1.splice(to_replace["array1"],1);
                upd_array2.splice(to_replace["array2"],1);
            }
        }
        return [upd_array1,upd_array2];
    }
};

// console.log(nodeRecent());
// console.log(nodeRecent(new Date('January 1, 2023 03:24:00')));
// let a1=[7,3];
// let a2=[3,7];
// console.log(a1,a2);
// console.log(rmve_overlap(a1,a2));

// Export functions for use in msg_triggers.js
module.exports= {
    nodeDate: nodeDate,
    nodeRecent: nodeRecent,
    rmve_overlap: rmve_overlap
}