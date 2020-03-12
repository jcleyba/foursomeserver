import { events, event } from './events'
import { bets, bet, createBet, projected } from './bets'
import { login, register } from './users'
import { AuthenticationError } from 'apollo-server'

//@ts-ignore
export const combineResolvers = (...funcs) => (...args) =>
  funcs.reduce(
    (prevPromise, resolver) =>
      prevPromise.then((prev: any) =>
        prev === undefined ? resolver(...args) : prev
      ),
    Promise.resolve()
  )

function protectedResolver(...args: any) {
  const [, , context] = args
  if (!context.user) throw new AuthenticationError('Must be logged in!')
}

export default {
  Query: {
    events: combineResolvers(protectedResolver, events),
    event: combineResolvers(protectedResolver, event),
    bets: combineResolvers(protectedResolver, bets),
    bet: combineResolvers(protectedResolver, bet),
    projected: combineResolvers(protectedResolver, projected),
  },
  Mutation: {
    createBet: combineResolvers(protectedResolver, createBet),
    login,
    register,
  },
}

/* 
await sql`
        CREATE TABLE IF NOT EXISTS users
        (
          id serial PRIMARY KEY,
          firstname VARCHAR (50) UNIQUE NOT NULL,
          lastname VARCHAR (50) UNIQUE NOT NULL,
   password text NOT NULL,
   email VARCHAR (100) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL
        );`;
        
await sql`
        CREATE TABLE IF NOT EXISTS bets
        (
          userid integer NOT NULL,
          eventid integer NOT NULL,
          players text[] NOT NULL,
          result numeric,
          created_on timestamp NOT NULL,
          PRIMARY KEY (userid, eventid),
          CONSTRAINT userid_fkey FOREIGN KEY (userid)
              REFERENCES users (id) MATCH SIMPLE
              ON UPDATE NO ACTION ON DELETE NO ACTION
        );`; 
        
await sql`select userid, username, SUM(result) from public.bets inner join public.users on public.bets.userid = public.users.id GROUP BY userid, username ORDER BY sum(result) desc;  `        
*/
