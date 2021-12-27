"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
var rp = require("request-promise");
dotenv.config();
// https://marketplace.zoom.us/docs/api-reference/zoom-api/
var Zoom = /** @class */ (function () {
    function Zoom(config) {
        this._config = config;
        var payload = {
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
    Zoom.prototype.listUsers = function () {
        var _this = this;
        this._options = __assign(__assign({}, this._options), { uri: this._config.apiUrl + "users/" });
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rp(this._options)];
                    case 1:
                        res = _a.sent();
                        resolve(res.users);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        reject(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Lists meetings associated with account
     * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings
     * @return {Array[{ id, start_time, ...}]} Array of meeting objects
     */
    Zoom.prototype.listMeetings = function () {
        var _this = this;
        this._options = __assign(__assign({}, this._options), { uri: this._config.apiUrl + "users/".concat(this._config.zoomUser, "/meetings/") });
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rp(this._options)];
                    case 1:
                        res = _a.sent();
                        resolve(res.meetings);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        reject(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Delete meeting by ID
     * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingdelete
     * @param {number} id The meeting id to be deleted
     * @return {void}
     */
    Zoom.prototype.deleteMeeting = function (id) {
        var _this = this;
        this._options = __assign(__assign({}, this._options), { method: "DELETE", uri: this._config.apiUrl + "meetings/".concat(id) });
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rp(this._options)];
                    case 1:
                        res = _a.sent();
                        resolve();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        reject(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Edit meeting associated with account
     * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate
     * @param {object} changes Changes to be made to meeting including ID
     * @return {void}
     */
    Zoom.prototype.editMeeting = function (changes) {
        var _this = this;
        this._options = __assign(__assign({}, this._options), { method: "PATCH", uri: this._config.apiUrl + "meetings/".concat(changes.id) });
        delete changes.id;
        this._options.body = changes;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rp(this._options)];
                    case 1:
                        res = _a.sent();
                        resolve();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        reject(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Create a meeting
     * https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
     * @param {object} options Options create a meeting
     * @return {void}
     */
    Zoom.prototype.createMeeting = function (options) {
        var _this = this;
        this._options = __assign(__assign({}, this._options), { method: "POST", uri: this._config.apiUrl + "users/".concat(this._config.zoomUser, "/meetings/"), body: {
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
            } });
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, rp(this._options)];
                    case 1:
                        res = _a.sent();
                        if (res.join_url)
                            resolve({ url: res.join_url, id: res.id });
                        else
                            throw { error: "Creating zoom meeting", res: res };
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        reject(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return Zoom;
}());
exports.default = Zoom;
