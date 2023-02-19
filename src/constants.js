/**
 * List of the courses you wish to follow.
 * You do not need an exact spelling, try to stay close to the title in the planning (look out for french/english titles).
 */
const COURSES = [
    // "Apprentissage pour les séries temporelles",
    "Nuages de points et modélisation 3D",
    "Sequential learning",
    "Deep learning in practice",
    "Algorithms for speech and natural language processing",
    "Discrete inference and learning",
    "Approches géométriques en apprentissage statistique"
];

// TODO: make it resiliant to exceptional events (seminars, school break, ...)

/**
 * ID of the MVA Google Calendar.
 * You need to add the Calendar for it to be accessible by you (use the + sign on the bottom right of the window).
 */
const MVA_AGENDA_ID = "duk0c7vf58cb9s64mn5ebkgh4c@group.calendar.google.com";

const MAIL_CONTENT = `
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <span style="font-family: 'Roboto', sans-serif;font-size: 12pt;">
        Hello,<br/><br/>
        Some courses were modified in the Google Calendar.<br/><br/>
    </span>
`;

const MY_MAIL_ADDRESS = "aubin.tchoi@gmail.com";
