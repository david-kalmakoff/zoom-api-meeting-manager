import {
  Config,
  Options,
  CreateMeeting,
  EditBody,
  Meeting,
} from "./types/Zoom";
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
  listUsers(): Promise<object> {
    this._options = {
      ...this._options,
      uri: this._config.apiUrl + "users/",
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve(res.users);
      } catch (error) {
        reject(error);
      }
    });
  }

  // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings
  listMeetings(): Promise<Array<Meeting>> {
    this._options = {
      ...this._options,
      uri: this._config.apiUrl + `users/${this._config.zoomUser}/meetings/`,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve(res.meetings);
      } catch (error) {
        reject(error);
      }
    });
  }

  // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingdelete
  deleteMeeting(id: number): Promise<void> {
    this._options = {
      ...this._options,
      method: "DELETE",
      uri: this._config.apiUrl + `meetings/${id}`,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingdelete
  editMeeting(changes: EditBody): Promise<void> {
    this._options = {
      ...this._options,
      method: "PATCH",
      uri: this._config.apiUrl + `meetings/${changes.id}`,
      body: {
        topic: changes.topic ? changes.topic : "Zoom Meeting",
        start_time: changes.start_time,
        duration: changes.duration,
        timezone: changes.timezone ? changes.timezone : "America/Winnipeg",
      },
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
  createMeeting(options: CreateMeeting): Promise<object> {
    this._options = {
      ...this._options,
      method: "POST",
      uri: this._config.apiUrl + `users/${this._config.zoomUser}/meetings/`,
      body: {
        topic: options.topic ? options.topic : "Zoom Meeting",
        type: 2,
        start_time: options.start_time,
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
          private_meeting: true,
        },
      },
    };

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        if (res.join_url) resolve({ url: res.join_url, id: res.id });
        else throw { error: "Creating zoom meeting", res };
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Zoom;
