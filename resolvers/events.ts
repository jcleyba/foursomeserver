import axios from 'axios'
import EventManager from '../utils/EventManager'
import { hasMailBeenSent } from '../utils/imap'
import { query as sql } from '../db'
import { sendTeeTimes } from '../utils/mailer'

export async function events() {
  try {
    const events = await EventManager.getEvents()

    return events
  } catch (e) {
    return e.response
  }
}

export async function event(_: any, args: Record<string, unknown>) {
  const { id: eventId } = args
  if (!eventId) return Error('Id is missing')
  try {
    const url = `${process.env.LEADERBOARD_ENDPOINT || ''}${eventId}`
    const { data } = await axios.get(url)
    const { leaderboard } = data
    const { id, name, competitors, status, season } = leaderboard
    const players = competitors
      ?.sort((a: any, b: any) => a.order - b.order)
      ?.map((player: Record<string, any>) => ({
        ...player,
        score: player.toPar,
        img: player?.img?.replace('.com', '.com/combiner/i?img='),
      }))

    return {
      id,
      name,
      status,
      season,
      leaderboard: {
        ...leaderboard,
        players,
      },
    }
  } catch (e) {
    return e
  }
}

export async function activeEvent() {
  try {
    const ev = await EventManager.getActiveEvent()

    return ev
  } catch (e) {
    return e.response
  }
}

export async function nextActiveEvent() {
  try {
    const ev = await EventManager.getNextActiveEvent()

    return ev
  } catch (e) {
    return e.response
  }
}

export async function compositeEvents() {
  try {
    const nextEvent = await EventManager.getNextActiveEvent()
    const currentEvent = await EventManager.getActiveEvent()

    if (currentEvent) {
      const activeEvent = await event(null, { id: currentEvent.id })
      return { activeEvent: { ...currentEvent, ...activeEvent }, nextEvent }
    }

    return { activeEvent: null, nextEvent }
  } catch (e) {
    return e.response
  }
}

export async function verifyTeeTimes() {
  try {
    const mailSent = await hasMailBeenSent()
    const nextEvent = await EventManager.getActiveEvent()
    console.debug('Mail sent: ', mailSent)

    if (!mailSent && nextEvent?.status === 'pre') {
      const next = await event(null, { id: nextEvent.id })
      if (next?.leaderboard?.players?.length) {
        const { rows } = await sql(
          `select email from users where verified = true;`
        )

        await sendTeeTimes(
          rows.map((row: { email: string }) => row.email),
          nextEvent.id,
          next.name
        )
      }
    }

    return true
  } catch (e) {
    return e.response
  }
}

export default { event, events }
