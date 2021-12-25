export interface Config {
  readonly apiUrl: string;
  readonly apiKey: string;
  readonly apiSecret: string;
  readonly defaultTitle?: string;
  readonly defaultTimezone?: string;
  readonly zoomUser: string;
  readonly contactName: string;
  readonly contactEmail: string;
}

interface Body {
  topic: string;
  readonly type: number;
  start_time: string;
  duration: number;
  default_password: boolean;
  timezone: string;
  settings: {
    readonly participant_video: boolean;
    readonly join_before_host: boolean;
    readonly watermark: boolean;
    readonly waiting_room: boolean;
    contact_name: string;
    contact_email: string;
    readonly registrants_confirmation_email: boolean;
    readonly private_meeting: boolean;
  };
}

export interface Options {
  readonly qs: { status: string };
  readonly auth: { bearer: string };
  readonly headers: {
    "User-Agent": string;
    "content-type": string;
  };
  readonly json: boolean;
  uri?: string;
  method?: string;
  body?: Body;
}

export interface CreateMeeting {
  title?: string;
  startTime: string;
  duration: number;
  timezone?: string;
}
