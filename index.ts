import { Config, Options, CreateMeeting } from "./types/Zoom";
import * as dotenv from "dotenv";

const jwt = require("jsonwebtoken");
const rp = require("request-promise");

dotenv.config();

// https://marketplace.zoom.us/docs/api-reference/zoom-api/
class Zoom {
  private _config: Config;
  private _token: string;
  private _options: Options;

  constructor(config: Config) {
    this._config = config;

    const payload = {
      iss: this._config.apiKey,
      exp: new Date().getTime() + 5000,
    };

    this._token = jwt.sign(payload, this._config.apiSecret);

    this._options = {
      qs: { status: "active" },
      auth: { bearer: this._token },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
      },
      json: true,
    };
  }

  // https://marketplace.zoom.us/docs/api-reference/zoom-api/users/users
  listUsers(): Promise<any> {
    this._options = {
      ...this._options,
      uri: this._config.apiUrl,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
  createMeeting(options: CreateMeeting): Promise<any> {
    this._options = {
      ...this._options,
      method: "POST",
      uri: this._config.apiUrl + `${this._config.zoomUser}/meetings/`,
      body: {
        topic: options.title ? options.title : "Zoom Meeting",
        type: 2,
        start_time: options.startTime,
        duration: options.duration,
        default_password: true,
        timezone: options.timezone ? options.timezone : "America/Winnipeg",
        settings: {
          participant_video: true,
          join_before_host: true,
          watermark: false,
          waiting_room: false,
          contact_name: this._config.contactName,
          contact_email: this._config.contactEmail,
          registrants_confirmation_email: true,
          private_meeting: true,
        },
      },
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Zoom;

// TODO: Remove lower testing content
// TODO: Add functionality to edit a meeting
// TODO: Add functionality to delete a meeting

const zoomConfig = {
  apiUrl: "https://api.zoom.us/v2/users/",
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  defaultTitle: process.env.DEFAULT_TITLE,
  defaultTimezone: process.env.DEFAULT_TIMEZONE,
  zoomUser: process.env.ZOOM_USER,
  contactName: process.env.CONTACT_NAME,
  contactEmail: process.env.CONTACT_EMAIL,
};

const zoom = new Zoom(zoomConfig);

// zoom.listUsers();
// const meeting: object = {
//   title: "Testing - Made in Canada Mall Stage Stream",
//   startTime: "2021-12-24T16:00:00",
//   duration: 30,
//   timezone: "America/Winnipeg",
// };
// zoom.createMeeting(meeting);
