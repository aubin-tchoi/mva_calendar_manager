function retrieve_local_calendar(calendar_name = "MVA") {
    /**
     * The name ${calendar_name} has to be free. Also expects the mva agenda to have a different name from ${calendar_name}.
     */
    const calendars = CalendarApp.getCalendarsByName(calendar_name).filter(calendar => calendar.isOwnedByMe());

    if (calendars.length == 0) {
        Logger.log(`Creating a new calendar under ${calendar_name}`);
        return CalendarApp.createCalendar(calendar_name);
    } else if (calendars.length == 1) {
        return calendars[0];
    } else {
        Logger.log(`Multiple calendars found with the name "${calendar_name}", using the first one found.`);
        return calendars[0];
    }
}

function retrieve_mva_calendar() {
    return CalendarApp.getCalendarById(MVA_AGENDA_ID);
}

function get_course_info(event, show_dates = true, show_location = true) {
    const time_info = `, ${event.getStartTime().toLocaleString()}, ${event.getEndTime().toLocaleString()}`,
        location_info = `, ${event.getLocation()}, ${event.getDescription()}`;
    return `${event.getTitle()}${show_dates ? time_info : ""}${show_location ? location_info: ""}`;
}

const course_logistic_details = event => event && `${event.getStartTime()}~${event.getLocation()}~${event.getDescription()}`;

function get_courses_from_calendar(calendar, course_names) {
    const now = new Date(),
        oneWeekFromNow = new Date(now.getTime() + (604800 - 86400) * 1000);

    return course_names.map(
        course_name => calendar.getEvents(
            now,
            oneWeekFromNow, {
                search: course_name
            }
        )
    ).flat(1);
}

const get_calendar_diff = (left_calendar_events, right_calendar_events) => left_calendar_events.filter(
    left_event => !right_calendar_events.filter(
        right_event => right_event.getTitle() == left_event.getTitle()
    ).some(
        right_event => course_logistic_details(right_event) == course_logistic_details(left_event)
    )
);
