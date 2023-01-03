# MVA Calendar Manager

## Purpose

The MVA shared calendar contains all the courses you can take, and it is likely to be updated frequently without any
sort of alert.
You can use the script found here to extract selectively the Calendar events of the courses you wish to take, to delete
the events relative to some courses, or to get a mail alert if a course was to be updated in the shared calendar.

## Install

- Create a project in Google Apps Script and copy all the files under `src` (replace `.js` files by `.gs` files) files.

OR

- Use `install.sh` (not tested thoroughly though).

## How to use

- Update the config (see [Parameters](#Parameters)).
- Run any of the entry-point functions mentioned below using the online IDE (notice that you can choose the function to
  run).

On your first use you will have to grant the script authorizations to the services used.

> You might have to add the shared calendar to get access to it from the script, look for the plus button in the
> bottom-right corner of the calendar window.

### Entry points

- `import_courses` in `import_courses.js`: imports the calendar events relative to the courses tracked from the mva
  shared calendar.
- `delete_courses` in `import_courses.js`: deletes the calendar events relative to the courses tracked from your local
  calendar.
- `report_course_movements` in `sync_changes.js`: sends a mail if any of the events relative to a course tracked differs
  between the two calendars. You might want to bind this one to a daily trigger.
- `count_incompatibilities` in `incompatibilities.js`: logs all the overlaps between courses registered in
  array `COURSES`.

> You might want to trigger function `report_course_movements` on a regular basis. To do so either add a trigger using
> the "Triggers" menu on the left bar of the Apps Script online IDE, or run function `createWeeklyTrigger`
> in `sync_changes.js`.

### Parameters

You can find all the parameters in file `constants.js`.

- `COURSES`: list of the courses you wish to track.
- `MVA_AGENDA_ID`: the ID of the MVA shared calendar.
- `MAIL_CONTENT`: the header of the mail you will receive as an alert.
- `MY_MAIL_ADDRESS`: the mail address that will receive the alerts.

### Implementation

The files are imported alphabetically, meaning that if there are 3 files names `a.js`, `b.js` and `c.js`, in file `c`
you can access the content of any file, in file `b` only the content of files `b` and `a` and in file `a` only the
content from within the file. This is actually while the file `base_utils.js` is not named `utils.js`.

You can use `clasp` to sync your local clone of the project with the Apps Script project:
see https://developers.google.com/apps-script/guides/clasp

If you want to do everything in command line (run functions, get logs, add triggers) you can do so using `clasp`,
however you need to link the project to a GCP and deal with API credentials.

- To link the project to a GCP, you can create one, copy its project number and paste it in the dedicated section
  of your Apps Script project's settings.
- To handle API credentials (required to use `clasp run <function_name>`) you will have to log in locally (copy your
  `.clasprc.json`) in the project folder and add the following urls to its `scope`
  variable: `https://mail.google.com/ https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/script.scriptapp`
  . Also add these urls to the manifest (`appsscript.json`) in the `oauthScope` array (
  see: https://developers.google.com/apps-script/manifest and https://developers.google.com/apps-script/concepts/scopes)
  Then run `clasp login --creds .clasprc.json` (not 100% guaranteed that will directly work, there might be a few steps
  I forgot about).
