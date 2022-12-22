/**
 * Script that counts the overlaps between courses taken from array COURSES by reading the mva calendar.
 * Does not take into account the travel time between course locations,
 * only counts the times where 2 or more courses simultanously take place.
 *
 * Specify the courses you wish to take in the COURSES array in constants.gs.
 * You do not need an exact spelling, try to stay close to the title in the planning (look out for french/english titles).
 *
 * If you get a getProperty of null on mva_calendar.getEvents,
 * it most likely means the mva_agenda_id is incorrect or not accessible by you.
 */


function count_incompatibilities() {
    const mva_calendar = retrieve_mva_calendar(),
        now = new Date(),
        sixMonthsFromNow = new Date(now.getTime() + 6 * 2628000 * 1000);

    // computing a derivative for the planning: +1 (resp. -1) at a time where a course starts (resp. ends)
    const derivative = COURSES.reduce(
        (acc, course_name) => {
            mva_calendar.getEvents(
                now,
                sixMonthsFromNow, {
                    author: "mvaenscachan@gmail.com",
                    search: course_name
                }
            ).forEach(
                ev => {
                    Logger.log(`Found event ${ev.getTitle()} on ${ev.getStartTime().toLocaleDateString('en-US')}.`);
                    acc[ev.getStartTime()] = (acc[ev.getStartTime()] || 0) + 1;
                    acc[ev.getEndTime()] = (acc[ev.getEndTime()] || 0) - 1;
                }
            );
            return acc;
        }, {}
    );

    // sorting the keys in an array
    const sortable = Object.keys(derivative)
        .sort((a, b) => new Date(a) - new Date(b));

    // computing the cumulative sum of derivative: it indicates the ongoing number of courses at each time steps
    let cumsum = sortable.reduce(
        (acc, date, idx) => {
            acc[idx] += derivative[date] + (idx > 0 ? acc[idx - 1] : 0);
            return acc;
        },
        new Array(sortable.length).fill(0)
    );

    const format_date = date => date.replace(":00 GMT+0100 (Central European Standard Time)", "");
    
    // cumsum[idx] is the number of courses taking place simultaneously on time step sortable[idx]
    sortable.map(
        (date, idx) => idx < sortable.length - 1 ?
        `${format_date(date)} to ${format_date(sortable[idx + 1])}:\n - ${COURSES.map(course_name => mva_calendar.getEvents(
            new Date(date),
            new Date(sortable[idx + 1]), {
                author: "mvaenscachan@gmail.com",
                search: course_name
            })).flat().map(ev => ev.getTitle()).join("\n - ")}` :
        ""
    ).filter((_, idx) => cumsum[idx] >= 2).forEach(Logger.log);
}