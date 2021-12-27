export interface Config {
  readonly apiUrl: string;
  readonly apiKey: string;
  readonly apiSecret: string;
  readonly defaultTopic?: string;
  readonly defaultTimezone?: string;
  readonly zoomUser: string;
  readonly contactName: string;
  readonly contactEmail: string;
}

export interface Meeting {
  readonly id: number;
  readonly topic: string;
  readonly start_time?: string;
  readonly duration: number;
  readonly join_url: string;
  readonly timezone: string;
}

export interface EditBody {
  id?: number;
  topic?: string;
  start_time?: string;
  duration?: number;
  timezone?: string;
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
  body?: Body | EditBody;
}

export interface CreateMeeting {
  topic?: string;
  start_time: string;
  duration: number;
  timezone?: string;
}
