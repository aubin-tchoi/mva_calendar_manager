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