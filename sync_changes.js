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
            if (local_minus_mva[title]?.length === 1 && mva_minus_local[title]?.length === 1) {
                modified = true;
                let location_change = (
                        (local_minus_mva[title][0].getLocation() !== mva_minus_local[title][0].getLocation()
                            || local_minus_mva[title][0].getDescription() !== mva_minus_local[title][0].getDescription())
                            ? `<br/>&nbsp;&nbsp;- Old location: ${local_minus_mva[title][0].getLocation()} ${local_minus_mva[title][0].getDescription()}<br/>
                        &nbsp;&nbsp;- New location: ${mva_minus_local[title][0].getLocation()} ${mva_minus_local[title][0].getDescription()}`
                            : ""
                    ),
                    time_change = (
                        local_minus_mva[title][0].getStartTime().toLocaleString() !== mva_minus_local[title][0].getStartTime().toLocaleString()
                            ? `<br/>&nbsp;&nbsp;- Old time: ${local_minus_mva[title][0].getStartTime()} to 
                        ${local_minus_mva[title][0].getEndTime()}<br/>
                        &nbsp;&nbsp;- New time: ${mva_minus_local[title][0].getStartTime()} to
                        ${mva_minus_local[title][0].getEndTime()}`
                            : ""
                    );
                htmlOutput.append(
                    `The following course was modified:<br/>
                &nbsp;${title}${location_change}${time_change}<br/><br/>`
                );
                Logger.log(`Updating the course info for ${title}.`);
                local_minus_mva[title][0].setTime(
                    mva_minus_local[title][0].getStartTime(),
                    mva_minus_local[title][0].getEndTime()
                );
                local_minus_mva[title][0].setDescription(
                    mva_minus_local[title][0].getDescription()
                );
            } else if (
                local_minus_mva[title] === undefined
                && mva_minus_local[title]?.length > 0
                && !title.startsWith("ANNULE - ")
            ) {
                modified = true;
                htmlOutput.append(
                    `The following course was added:<br/>
                &nbsp;- ${mva_minus_local[title].map(get_course_info).join("<br/>&nbsp;- ")}<br/><br/>`
                );
                Logger.log(`Adding course info for ${title}.`);
                mva_minus_local[title].forEach(
                    ev => {
                        local_calendar.createEvent(
                            ev.getTitle(),
                            ev.getStartTime(),
                            ev.getEndTime(), {
                                description: ev.getDescription(),
                                location: ev.getLocation(),
                            }
                        );
                    }
                );
            } else if (local_minus_mva[title]?.length > 0 && mva_minus_local[title] === undefined) {
                modified = true;
                htmlOutput.append(
                    `The following course was removed:<br/>
                &nbsp;- ${local_minus_mva[title].map(get_course_info).join("<br/>&nbsp;- ")}<br/><br/>`
                );
                Logger.log(`Removing course event for ${title}.`);
                local_minus_mva[title].forEach(ev => {
                    ev.deleteEvent()
                });
            } else if (local_minus_mva[title]?.length > 0 && mva_minus_local[title]?.length > 0) {
                modified = true;
                htmlOutput.append(
                    `The courses ${title} were moved around.<br/><br/>`
                );
            }
        }
    );

    if (modified) {
        let msgHtml = htmlOutput.getContent(),
            msgPlain = htmlOutput.getContent().replace(/<br\/>/gi, '\n').replace(/(<([^>]+)>)/ig, "");
        Logger.log(`Sending a mail to ${MY_MAIL_ADDRESS}.`);
        GmailApp.sendEmail(MY_MAIL_ADDRESS, "MVA planning update", msgPlain, {
            htmlBody: msgHtml
        });
    }
}
