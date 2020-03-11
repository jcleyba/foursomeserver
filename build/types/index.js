"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gql = require("apollo-server").gql;
var typeDefs = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Event {\n    id: ID\n    name: String\n    startDate: String\n    endDate: String\n    leaderboard: Leaderboard\n  }\n\n  type Leaderboard {\n    status: String\n    players: [Player]\n  }\n\n  type Player {\n    id: ID\n    name: String\n    pos: String\n    score: String\n    img: String\n    flag: String\n  }\n  type Bet {\n    userId: String\n    eventId: String\n    players: [Player]\n    result: Float\n  }\n\n  input PlayersInput {\n    id: ID\n  }\n\n  type Query {\n    events: [Event]\n    event(id: String): Event\n    bets: [Bet]\n    bet(userId: String, eventId: String): Bet\n  }\n\n  type Mutation {\n    createBet(userId: String, eventId: String, players: [PlayersInput]): Bet\n  }\n"], ["\n  type Event {\n    id: ID\n    name: String\n    startDate: String\n    endDate: String\n    leaderboard: Leaderboard\n  }\n\n  type Leaderboard {\n    status: String\n    players: [Player]\n  }\n\n  type Player {\n    id: ID\n    name: String\n    pos: String\n    score: String\n    img: String\n    flag: String\n  }\n  type Bet {\n    userId: String\n    eventId: String\n    players: [Player]\n    result: Float\n  }\n\n  input PlayersInput {\n    id: ID\n  }\n\n  type Query {\n    events: [Event]\n    event(id: String): Event\n    bets: [Bet]\n    bet(userId: String, eventId: String): Bet\n  }\n\n  type Mutation {\n    createBet(userId: String, eventId: String, players: [PlayersInput]): Bet\n  }\n"])));
exports.default = typeDefs;
var templateObject_1;
