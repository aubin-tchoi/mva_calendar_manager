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


function report_course_movements() {
    /**
     * Computes the symmetrical difference of two calendars: the mva calendar filtered on the courses taken and the local one.
     */
    const mva_calendar = retrieve_mva_calendar(),
        local_calendar = retrieve_local_calendar(),
        mva_courses = get_courses_from_calendar(mva_calendar, COURSES),
        local_courses = get_courses_from_calendar(local_calendar, COURSES),
        local_minus_mva = get_calendar_diff(local_courses, mva_courses).reduce(
            (obj, event) => {
                obj[event.getTitle()] = (obj[event.getTitle()] || []);
                obj[event.getTitle()].push(event);
                return obj
            }, {}
        ) || [],
        mva_minus_local = get_calendar_diff(mva_courses, local_courses).reduce(
            (obj, event) => {
                obj[event.getTitle()] = (obj[event.getTitle()] || []);
                obj[event.getTitle()].push(event);
                return obj
            }, {}
        ) || [];

    let modified = false,
        htmlOutput = HtmlService.createHtmlOutput(MAIL_CONTENT);

    [...new Set([
        ...Object.keys(mva_minus_local),
        ...Object.keys(local_minus_mva)
    ])].forEach(
        title => {
            if (local_minus_mva[title].length == 1 && mva_minus_local[title].length == 1) {
                modified = true;
                let options = [
                    local_minus_mva[title][0].getStartTime() == mva_minus_local[title][0].getStartTime(),
                    local_minus_mva[title][0].getLocation() == mva_minus_local[title][0].getLocation() &&
                    local_minus_mva[title][0].getDescription() == mva_minus_local[title][0].getDescription(),
                ];
                htmlOutput.append(
                    `The following course was modified:<br/>
                &nbsp;- Old course: ${get_course_info(
                      local_minus_mva[title][0],
                      ...options
                  )}<br/>
                &nbsp;- New course: ${get_course_info(
                      mva_minus_local[title][0],
                      ...options
                  )}<br/><br/>`
                );
                Logger.log(`Updating the course info for ${title}.`);
                local_minus_mva[title][0].setTime(
                    mva_minus_local[title][0].getStartTime(),
                    mva_minus_local[title][0].getEndTime()
                );
                local_minus_mva[title][0].setDescription(
                    mva_minus_local[title][0].getDescription()
                );
            } else if (local_minus_mva[title] === undefined && mva_minus_local[title].length > 0) {
                modified = true;
                htmlOutput.append(
                    `The following course was added:<br/>
                &nbsp;- ${mva_minus_local[title].map(get_course_info).join("<br/>&nbsp;- ")}<br/><br/>`
                );
            } else if (local_minus_mva[title].length > 0 && mva_minus_local[title] === undefined) {
                modified = true;
                htmlOutput.append(
                    `The following course was removed:<br/>
                &nbsp;- ${local_minus_mva[title].map(get_course_info).join("<br/>&nbsp;- ")}<br/><br/>`
                );
            } else if (local_minus_mva[title].length > 0 && mva_minus_local[title].length > 0) {
                modified = true;
                htmlOutput.append(
                    `The courses ${title} were moved around.<br/><br/>`
                );
            }
        }
    );

    if (modified) {
        let msgHtml = htmlOutput.getContent(),
            msgPlain = htmlOutput.getContent().replace(/\<br\/\>/gi, '\n').replace(/(<([^>]+)>)/ig, "");
        Logger.log(`Sending a mail to ${MY_MAIL_ADDRESS}.`);
        GmailApp.sendEmail(MY_MAIL_ADDRESS, "MVA planning update", msgPlain, {
          htmlBody: msgHtml
        });
    }
}