# Zoom API Meeting Manager

TODO: add package to npm
TODO: clean up code and add descriptions to methods

Javascript (NodeJS) package to easily manage Zoom meetings.

## Install Package

```
$ npm install zoom-api-meeting-manager
```

## Add Package to Project

```javascript
const Zoom = require("zoom-api-meeting-manager");
const zoomOptions = {
  apiUrl: "https://api.zoom.us/v2/users/",
  apiKey: "api_key",
  apiSecret: "api_secret",
  defaultTopic: "default_topic", // optional
  defaultTimezone: "default_timezone", // optional
  zoomUser: "zoom_user",
  contactName: "contact_name",
  contactEmail: "contact_email",
};
const zoom = new Zoom(zoomOptions);
```

## List Available Users

```javascript
zoom
  .listUsers() // Returns array of user data objects { id, email, ... }
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
```

## Create New Meeting

```javascript
const meeting = {
  topic: "Potential Meeting Title",
  start_time: "2022-01-01T12:00:00",
  duration: 30,
  timezone: "America/Winnipeg",
};

zoom
  .createMeeting(meeting) // Returns meeting object { url, id }
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
```

## List Existing Meetings

```javascript
zoom
  .listMeetings() // Returns array of meeting objects { id, start_time, ... }
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
```

## Delete Meeting

```javascript
zoom.deleteMeeting(meetingID).catch((error) => console.log(error));
```

## Edit Meeting

```javascript
const editMeeting = {
  id: meetingID, // Required
  topic: "New Potential Meeting Title", // Optional
  start_time: "2022-01-02T12:00:00", // Optional
  duration: 30, // Optional
  timezone: "America/Winnipeg", // Optional
};

zoom.editMeeting(editMeeting).catch((error) => console.log(error));
```
