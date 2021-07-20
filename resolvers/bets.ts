import axios from 'axios'
import { query as sql, pool } from '../db'
import EventManager from '../utils/EventManager'

const EVENT_STARTED = 'in'
const EVENT_PREV = 'pre'
const EVENT_FINISHED = 'post'

export async function bets() {
  try {
    const { rows: bet } = await sql(`select id, userId from bets;`)

    return bet
  } catch (e) {
    return e
  }
}

export async function bet(_: any, args: any, context: any) {
  try {
    const { user } = context.user
    const { eventId } = args

    const {
      rows: { [0]: bet },
    } = await sql(
      `select * from bets where 
    userid = $1 and eventid = $2;`,
      [user.id, eventId]
    )

    if (!bet) {
      return null
    }
    const { data } = await axios.get(
      `${process.env.LEADERBOARD_ENDPOINT}${eventId}`
    )

    const { userid, eventid, players: storedBet, result: res } = bet
    const { leaderboard } = data

    const players = mapPlayers(storedBet, leaderboard.competitors)
    // Checking if tournament started or finished
    const result =
      leaderboard.status === EVENT_STARTED ? calcResult(players) : res

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

export async function createBet(_: any, args: any, context: any) {
  try {
    const { user } = context.user
    const { eventId, players, season } = args

    const activeEvent: any = await EventManager.getActiveEvent()

    if (activeEvent?.id !== eventId) {
      return Error('Event already finished or in play')
    }

    const plyrsSql = players.map((a: Record<string, unknown>) => a.id)

    const {
      rows: { [0]: bet },
    } = await sql(
      `insert into bets (userid, eventid, players, result, created_on, season) values (
      $1, $2, $3, $4, $5, $6) 
      ON CONFLICT (userid, eventid) DO UPDATE SET players = $3 returning * `,
      [user.id, eventId, plyrsSql, 0, new Date().toISOString(), season]
    )

    return {
      ...bet,
      userId: user.id,
      eventId,
      season,
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

    const { rows: ranking } =
      await sql(`select userid, firstname, lastname, SUM(result) 
    from bets inner join users on bets.userid = users.id where season = 2021
    GROUP BY userid, firstname, lastname ORDER BY sum(result) desc`)

    const { leaderboard } = data

    if (leaderboard?.status === EVENT_STARTED) {
      const { rows: bets } = await sql(
        `select * from bets where eventid = $1`,
        [eventId]
      )

      let proj: any = {}
      for (let bet of bets) {
        const players = mapPlayers(bet.players, leaderboard.competitors)
        const points = calcResult(players)
        proj[bet.userid] = { ...bet, points }
      }

      return ranking.map((rank: any) => ({
        firstName: rank.firstname,
        lastName: rank.lastname,
        points: rank.sum,
        projectedPoints: proj[rank.userid]?.points,
      }))
    }

    return ranking.map((rank: any) => ({
      firstName: rank.firstname,
      lastName: rank.lastname,
      points: rank.sum,
    }))
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function ranking(_: any) {
  try {
    const { rows: ranking } = await sql(
      `select userid, firstname, lastname, SUM(result) from bets inner join users on bets.userid = users.id where season = 2021 GROUP BY userid, firstname, lastname ORDER BY sum(result) desc;`
    )

    return ranking?.map((r: any) => ({
      firstName: r.firstname,
      lastName: r.lastname,
      points: r.sum,
    }))
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function updateResults(_: any, args: any) {
  try {
    let { eventId } = args

    if (!args.eventId) {
      const lastEvent = await EventManager.getLastActiveEvent()

      eventId = lastEvent.id
    }

    if (!eventId) {
      return Error('Invalid request. Wrong eventId')
    }

    const { data } = await axios.get(process.env.LEADERBOARD_ENDPOINT + eventId)
    const { leaderboard } = data

    if (!data || !leaderboard) return Error('Error getting leaderboard')

    const { rows: bets } = await sql(`select * from bets where eventid = $1`, [
      eventId,
    ])

    if (bets) {
      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        for (let bet of bets) {
          const players = mapPlayers(bet.players, leaderboard.competitors)
          const points = calcResult(players)

          await client.query(
            `update bets set result = $1 where userid = $2 and eventid = $3`,
            [points, bet.userid, bet.eventid]
          )
        }

        client.query('COMMIT')

        return true
      } catch (e) {
        console.error(e)
        await client.query('ROLLBACK')
        throw e
      } finally {
        console.debug('release client')

        client.release()
      }
    } else {
      return Error('No bets found')
    }
  } catch (e) {
    console.error(e)
    return e
  }
}

export async function eventWinner() {
  try {
    const lastEvent = await EventManager.getLastActiveEvent()
    const {
      rows: { [0]: bet },
    } = await sql(
      `select userid, firstname, lastname, result from bets inner join users on bets.userid = users.id WHERE eventid = $1  ORDER BY result desc limit 1;`,
      [lastEvent?.id]
    )

    return {
      user: {
        firstName: bet.firstname,
        lastName: bet.lastname,
      },
      bet: { result: bet.result },
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
    const pl: any = entry[player]
    ret.push({ ...pl, img: pl?.img?.replace('.com', '.com/combiner/i?img=') })
  }

  return ret
}

const calcResult = (players: any[] = []) => {
  if (!players.length) return 0
  let sum = 0

  for (let player of players) {
    const position = player.pos
    if (!position || position === '-') {
      sum += 0
    } else {
      const number: number = parseFloat(position.replace('T', ''))
      sum += (1 / number) * 100
    }
  }

  return sum.toFixed(2)
}

export default { bet, bets, createBet }
