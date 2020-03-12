import axios from 'axios'
import sql from '../db'

export async function bets() {
  try {
    const [bet] = await sql`select id, userId from bets;`

    return bet
  } catch (e) {
    throw e
  }
}

export async function bet(_: any, args: any, context: any) {
  try {
    const { userId, eventId } = args
    const [bet] = await sql`select * from bets where 
    userid = ${userId} and eventid = ${eventId}`

    const { data } = await axios.get(
      'https://www.espn.com/golf/leaderboard?_xhr=pageContent&tournamentId=' +
        eventId
    )

    const { userid, eventid, players: storedBet, storedResult } = bet
    const { leaderboard } = data

    const players = mapPlayers(storedBet, leaderboard.competitors)

    // Checking if tournament started or finished
    const result = data.status !== 'pre' ? calcResult(players) : 0

    return {
      userId: userid,
      eventId: eventid,
      players,
      result,
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function createBet(_: any, args: any) {
  try {
    const { userId, eventId, players } = args

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
    throw e
  }
}

const mapPlayers = (players: any[], competitors: any[]) => {
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

const calcResult = (players: any[]) => {
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
