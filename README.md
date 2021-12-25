# Zoom API Meeting Manager

TODO: add package to npm

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
  defaultTitle: "default_title", // optional
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
  .listUsers()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
```

## Create New Meeting

```javascript
const meeting = {
  title: "Potential Meeting Title",
  startTime: "2022-01-01T12:00:00",
  duration: 30,
  timezone: "America/Winnipeg",
};

zoom
  .createMeeting(meeting)
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
```
