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

  /**
   * Lists users associated with account
   * https://marketplace.zoom.us/docs/api-reference/zoom-api/users/users
   * @return {Array[{ id, email, ... }]} Array of user objects
   */
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

  /**
   * Lists meetings associated with account
   * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings
   * @return {Array[{ id, start_time, ...}]} Array of meeting objects
   */
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

  /**
   * Delete meeting by ID
   * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingdelete
   * @param {number} id The meeting id to be deleted
   * @return {void}
   */
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

  /**
   * Edit meeting associated with account
   * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate
   * @param {object} changes Changes to be made to meeting including ID
   * @return {void}
   */
  editMeeting(changes: EditBody): Promise<void> {
    this._options = {
      ...this._options,
      method: "PATCH",
      uri: this._config.apiUrl + `meetings/${changes.id}`,
    };

    delete changes.id;

    this._options.body = changes;

    return new Promise(async (resolve, reject) => {
      try {
        const res = await rp(this._options);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Create a meeting
   * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
   * @param {object} options Options create a meeting
   * @return {void}
   */
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
