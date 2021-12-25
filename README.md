# Zoom API Meeting Manager

TODO: add package to npm

```
$ npm install zoom-api-meeting-manager
```

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
