import axios from 'axios'
import sql from '../db'
import EventManager from '../utils/EventManager'

const EVENT_STARTED = 'in'
const EVENT_PREV = 'pre'
const EVENT_FINISHED = 'post'

export async function bets() {
  try {
    const [bet] = await sql`select id, userId from bets;`

    return bet
  } catch (e) {
    return e
  }
}

export async function bet(_: any, args: any, context: any) {
  try {
    const { userId, eventId } = args
    const [bet] = await sql`select * from bets where 
    userid = ${userId} and eventid = ${eventId}`

    if (!bet) {
      return null
    }

    const { data } = await axios.get(
      process.env.LEADERBOARD_ENDPOINT || '' + eventId
    )

    const { userid, eventid, players: storedBet } = bet
    const { leaderboard } = data

    const players = mapPlayers(storedBet, leaderboard.competitors)

    // Checking if tournament started or finished
    const result =
      leaderboard.status === EVENT_STARTED ? calcResult(players) : 0

    return {
      userId: userid,
      eventId: eventid,
      players,
      result,
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function createBet(_: any, args: any) {
  try {
    const { userId, eventId, players } = args

    const activeEvent: any = await EventManager.getActiveEvent()
    if (activeEvent?.id !== eventId) {
      return Error('Event already finished or in play')
    }

    const [
      bet,
    ] = await sql`insert into bets (userid, eventid, players, result, created_on) values (
      ${userId}, ${eventId}, ${sql.array(
      players.map((a: Record<string, unknown>) => a.id)
    )}, 0, ${new Date().toISOString()}) returning *`

    return {
      ...bet,
      userId,
      eventId,
      season: new Date(bet.created_on).getFullYear(),
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function projected(_: any, args: any) {
  try {
    const { eventId } = args

    const { data } = await axios.get(process.env.LEADERBOARD_ENDPOINT + eventId)

    const ranking = await sql`select userid, firstname, lastname, SUM(result) 
    from bets inner join users on bets.userid = users.id 
    GROUP BY userid, firstname, lastname ORDER BY sum(result) desc`

    const { count } = ranking
    const { leaderboard } = data

    if (leaderboard?.status === EVENT_STARTED) {
      const bets = await sql`select * from bets where eventid = ${eventId}`
      const { count } = bets

      let proj: any = {}
      for (let bet of bets.slice(0, count)) {
        const players = mapPlayers(bet.players, leaderboard.competitors)
        const points = calcResult(players)
        proj[bet.userid] = { ...bet, points }
      }

      return ranking.slice(0, count).map((rank: any) => ({
        firstName: rank.firstname,
        lastName: rank.lastname,
        points: rank.sum,
        projectedPoints: proj[rank.userid]?.points,
      }))
    }

    return ranking.slice(0, count).map((rank: any) => ({
      firstName: rank.firstname,
      lastName: rank.lastname,
      points: rank.sum,
    }))
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function updateResults(eventId: string) {
  try {
    if (!eventId) return Error('Invalid request')

    const { data } = await axios.get(process.env.LEADERBOARD_ENDPOINT + eventId)
    const { leaderboard } = data

    if (!data || !leaderboard) return Error('Error getting leaderboard')

    const bets = await sql`select * from bets where eventid = ${eventId}`

    if (bets) {
      const { count } = bets

      await sql.begin(async (sql: any) => {
        for (let bet of bets.slice(0, count)) {
          const players = mapPlayers(bet.players, leaderboard.competitors)
          const points = calcResult(players)
          const [
            update,
          ] = await sql`update bets set result = ${points} where userid = ${bet.userid} and eventid = ${bet.eventid}`
        }
      })
      return true
    } else {
      return Error('No bets found')
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

const mapPlayers = (players: any[], competitors: any[]) => {
  if (!players || !competitors) return []
  let entry: Record<string, unknown> = {}
  for (let comp of competitors) {
    entry[comp.id] = comp
  }
  let ret = []
  for (let player of players) {
    ret.push(entry[player])
  }

  return ret
}

const calcResult = (players: any[] = []) => {
  if (!players.length) return 0
  let sum = 0

  for (let player of players) {
    const position = player.pos
    if (position === '-') {
      sum += 0
    } else {
      const number: number = parseFloat(position.replace('T', ''))
      sum += (1 / number) * 100
    }
  }

  return sum.toFixed(2)
}

export default { bet, bets, createBet }
