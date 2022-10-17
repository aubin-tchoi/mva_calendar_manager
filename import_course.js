/**
 * Script that imports the courses events from the mva planning to your local calendar.
 *
 * Specify the courses you wish to take in the COURSES array in constants.gs.
 * You do not need an exact spelling, try to stay close to the title in the planning (look out for French/english titles).
 *
 * If you get a getProperty of null on mva_calendar.getEvents,
 * it means the mva_agenda_id is incorrect or not accessible by you.
 */


function import_courses() {
    const mva_calendar = retrieve_mva_calendar(),
        local_calendar = retrieve_local_calendar(),
        now = new Date(),
        sixMonthsFromNow = new Date(now.getTime() + 6 * 2628000 * 1000);
    let counter = 0;

    COURSES.forEach(
        course_name => {
            mva_calendar.getEvents(
                now,
                sixMonthsFromNow, {
                    author: "mvaenscachan@gmail.com",
                    search: course_name
                }
            ).forEach(
                ev => {
                    Logger.log(`Adding event ${ev.getTitle()} on ${ev.getStartTime().toLocaleDateString('en-US')} to local calendar.`);
                    local_calendar.createEvent(
                        ev.getTitle(),
                        ev.getStartTime(),
                        ev.getEndTime(), {
                            description: ev.getDescription(),
                            location: ev.getLocation(),
                        }
                    );
                    counter++;
                }
            )
        }
    );
    Logger.log(`Added ${counter} calendar events.`);
}


function delete_courses() {
    const local_calendar = retrieve_local_calendar(),
        now = new Date(),
        sixMonthsFromNow = new Date(now.getTime() + 6 * 2628000 * 1000);
    let counter = 0;

    COURSES.forEach(
        course_name => {
            local_calendar.getEvents(
                now,
                sixMonthsFromNow, {
                    search: course_name
                }
            ).forEach(ev => {
                Logger.log(`Deleting event ${ev.getTitle()} on ${ev.getStartTime().toLocaleDateString('en-US')} from local calendar.`);
                ev.deleteEvent();
                counter++;
            });
        }
    );
    Logger.log(`Deleted ${counter} calendar events.`);
}
