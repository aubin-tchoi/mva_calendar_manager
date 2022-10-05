# MVA Calendar Manager

## Purpose

The MVA shared calendar contains all the courses you can take, and it is likely to be updated frequently without any sort of alert.
You can use the script found here to extract selectively the Calendar events of the courses you wish to take, to delete the events relative to some courses, or to get a mail alert if a course was to be updated in the shared calendar.

## How to use

- Create a project in Google Apps Script and copy all the files here in `.gs` files.
- Update the config (see [Parameters](#Parameters)).
- Run any of the entry-point functions mentioned below using the online IDE (notice that you can choose the function to run).

On your first use you will have to grant the script authorizations to the services used.

> You might have to add the shared calendar to get access to it from the script, look for the plus button on the bottom-right corner of the calendar window.

### Entry points

- `import_courses` in `import_courses.js`: imports the calendar events relative to the courses tracked from the mva shared calendar.
- `delete_courses` in `import_courses.js`: deletes the calendar events relative to the courses tracked from your local calendar.
- `report_course_movements` in `sync_changes.js`: sends a mail if any of the events relative to a course tracked differs between the two calendars. You might want to bind this one to a daily trigger.

### Parameters

You can find all the parameters in file `constants.js`.

- `COURSES`: list of the courses you wish to track.
- `MVA_AGENDA_ID`: the ID of the MVA shared calendar.
- `MAIL_CONTENT`: the header of the mail you will receive as an alert.
- `MY_MAIL_ADDRESS`: the mail address that will receieve the alerts.

### Implementation

The files are imported alphabetically, meaning that if there are 3 files names `a.js`, `b.js` and `c.js`, in file `c` you can access the content of any file, in file `b` only the content of files `b` and `a` and in file `a` only the content from within the file. This is actually while the file `base_utils.js` is not named `utils.js`.

You can use `clasp` to sync your local clone of the project with the Apps Script project: see https://developers.google.com/apps-script/guides/clasp 
