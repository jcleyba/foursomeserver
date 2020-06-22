import { AuthenticationError } from 'apollo-server'
import {
  bet,
  bets,
  createBet,
  projected,
  updateResults,
  ranking,
  eventWinner,
} from './bets'
import {
  activeEvent,
  event,
  events,
  nextActiveEvent,
  compositeEvents,
} from './events'
import { forgot, login, register, resetPassword, verify } from './users'

export const combineResolvers = (...funcs: any[]) => (...args: any[]) =>
  funcs.reduce(
    (prevPromise: Promise<any>, resolver: Function) =>
      prevPromise.then((prev: any) =>
        prev === undefined ? resolver(...args) : prev
      ),
    Promise.resolve()
  )

function protectedResolver(...args: any) {
  const [, , context] = args
  if (!context.user) return new AuthenticationError('Must be logged in!')
}

export default {
  Query: {
    events: combineResolvers(protectedResolver, events),
    compositeEvents: combineResolvers(protectedResolver, compositeEvents),
    event: combineResolvers(protectedResolver, event),
    bets: combineResolvers(protectedResolver, bets),
    bet: combineResolvers(protectedResolver, bet),
    projected: combineResolvers(protectedResolver, projected),
    activeEvent: combineResolvers(protectedResolver, activeEvent),
    nextActiveEvent: combineResolvers(protectedResolver, nextActiveEvent),
    ranking: combineResolvers(protectedResolver, ranking),
    eventWinner: combineResolvers(protectedResolver, eventWinner),
  },
  Mutation: {
    createBet: combineResolvers(protectedResolver, createBet),
    login,
    register,
    verify,
    forgot,
    resetPassword,
    updateResults: combineResolvers(protectedResolver, updateResults),
  },
}

/* 
await sql`
        CREATE TABLE IF NOT EXISTS users
        (
          id serial PRIMARY KEY,
          firstname VARCHAR (50) NOT NULL,
          lastname VARCHAR (50) NOT NULL,
   password text NOT NULL,
   email VARCHAR (100) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
   verified BOOL NOT NULL,
   token text
        );`;
        
await sql`
        CREATE TABLE IF NOT EXISTS bets
        (
          userid integer NOT NULL,
          eventid integer NOT NULL,
          players text[] NOT NULL,
          result numeric,
          season integer NOT NULL,
          created_on timestamp NOT NULL,
          PRIMARY KEY (userid, eventid),
          CONSTRAINT userid_fkey FOREIGN KEY (userid)
              REFERENCES users (id) MATCH SIMPLE
              ON UPDATE NO ACTION ON DELETE NO ACTION
        );`; 
        
await sql`select userid, username, SUM(result) from public.bets inner join public.users on public.bets.userid = public.users.id GROUP BY userid, username ORDER BY sum(result) desc;  `        
*/
