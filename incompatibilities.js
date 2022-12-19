

function count_incompatibilities() {
    const mva_calendar = retrieve_mva_calendar(),
        now = new Date(),
        sixMonthsFromNow = new Date(now.getTime() + 6 * 2628000 * 1000);

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
        },
        {}
    );

    const sortable = Object.keys(derivative)
        .sort((a, b) => a - b);
    
    let cumsum = sortable.reduce(
      (acc, date, idx) => {
        acc[idx] += derivative[date] + (idx > 0 ? acc[idx - 1] : 0);
        return acc;
      },
      new Array(sortable.length).fill(0)
    );

    let overlaps = sortable.map((date, idx) => `${date}: ${cumsum[idx]}`).filter((_, idx) => cumsum[idx] >= 2);
    overlaps.forEach(Logger.log);
}
