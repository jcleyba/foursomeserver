"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var db_1 = __importDefault(require("../db"));
function bets() {
    return __awaiter(this, void 0, void 0, function () {
        var bet_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            select id, userId from bets\n          "], ["\n            select id, userId from bets\n          "])))];
                case 1:
                    bet_1 = (_a.sent())[0];
                    return [2 /*return*/, bet_1];
                case 2:
                    e_1 = _a.sent();
                    throw e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.bets = bets;
function bet(_, args) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, eventId, bet_2, data, userid, eventid, storedBet, storedResult, leaderboard, players, result, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userId = args.userId, eventId = args.eventId;
                    return [4 /*yield*/, db_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["select * from bets where \n    userid = ", " and eventid = ", ""], ["select * from bets where \n    userid = ", " and eventid = ", ""])), userId, eventId)];
                case 1:
                    bet_2 = (_a.sent())[0];
                    return [4 /*yield*/, axios_1.default.get('https://www.espn.com/golf/leaderboard?_xhr=pageContent&tournamentId=' +
                            eventId)];
                case 2:
                    data = (_a.sent()).data;
                    userid = bet_2.userid, eventid = bet_2.eventid, storedBet = bet_2.players, storedResult = bet_2.storedResult;
                    leaderboard = data.leaderboard;
                    players = mapPlayers(storedBet, leaderboard.competitors);
                    result = !storedResult && data.status !== 'pre' ? calcResult(players) : 0;
                    return [2 /*return*/, {
                            userId: userid,
                            eventId: eventid,
                            players: players,
                            result: result,
                        }];
                case 3:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.bet = bet;
function createBet(_, args) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, eventId, players, bet_3, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = args.userId, eventId = args.eventId, players = args.players;
                    return [4 /*yield*/, db_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["insert into bets (userid, eventid, players, result, created_on) values (\n      ", ", ", ", ", ", 0, ", ") returning *"], ["insert into bets (userid, eventid, players, result, created_on) values (\n      ", ", ", ", ",
                            ", 0, ", ") returning *"])), userId, eventId, db_1.default.array(players.map(function (a) { return a.id; })), new Date().toISOString())];
                case 1:
                    bet_3 = (_a.sent())[0];
                    return [2 /*return*/, __assign(__assign({}, bet_3), { userId: userId,
                            eventId: eventId })];
                case 2:
                    e_3 = _a.sent();
                    console.error(e_3);
                    throw e_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createBet = createBet;
var mapPlayers = function (players, competitors) {
    var entry = {};
    for (var _i = 0, competitors_1 = competitors; _i < competitors_1.length; _i++) {
        var comp = competitors_1[_i];
        entry[comp.id] = comp;
    }
    var ret = [];
    for (var _a = 0, players_1 = players; _a < players_1.length; _a++) {
        var player = players_1[_a];
        ret.push(entry[player]);
    }
    return ret;
};
var calcResult = function (players) {
    var sum = 0;
    for (var _i = 0, players_2 = players; _i < players_2.length; _i++) {
        var player = players_2[_i];
        var position = player.pos;
        var number = parseFloat(position.replace('T', ''));
        sum += (1 / number) * 100;
    }
    return sum.toFixed(2);
};
exports.default = { bet: bet, bets: bets, createBet: createBet };
var templateObject_1, templateObject_2, templateObject_3;
