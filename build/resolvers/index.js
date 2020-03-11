"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("./events");
var bets_1 = require("./bets");
exports.default = {
    Query: {
        events: events_1.events,
        event: events_1.event,
        bets: bets_1.bets,
        bet: bets_1.bet,
    },
    Mutation: {
        createBet: bets_1.createBet,
    },
};
/*
await sql`
        CREATE TABLE IF NOT EXISTS users
        (
          id serial PRIMARY KEY,
          username VARCHAR (50) UNIQUE NOT NULL,
   password VARCHAR (50) NOT NULL,
   email VARCHAR (355) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL
        );`;
        
await sql`
        CREATE TABLE IF NOT EXISTS bets
        (
          userid integer NOT NULL,
          eventid integer NOT NULL,
          players text[] NOT NULL,
          result numeric,
          PRIMARY KEY (userid, eventid),
          CONSTRAINT userid_fkey FOREIGN KEY (userid)
              REFERENCES users (id) MATCH SIMPLE
              ON UPDATE NO ACTION ON DELETE NO ACTION
        );`;
        
await sql`select userid, username, SUM(result) from public.bets inner join public.users on public.bets.userid = public.users.id GROUP BY userid, username ORDER BY sum(result) desc;  `
*/
