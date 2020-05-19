import axios from 'axios'
import EventManager from '../utils/EventManager'

export async function events() {
  try {
    const events = await EventManager.getEvents()

    return events.map((ev: any) => {
      return { ...ev, location: ev.locations[0].venue.fullName }
    })
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

    return {
      id,
      name,
      status,
      season,
      leaderboard: {
        ...leaderboard,
        players: competitors
          ?.sort((a: any, b: any) => a.order - b.order)
          ?.map((player: Record<string, unknown>) => ({
            ...player,
            score: player.toPar,
          })),
      },
    }
  } catch (e) {
    return e
  }
}

export async function activeEvent() {
  try {
    const ev = await EventManager.getActiveEvent()

    return { ...ev, location: ev.locations[0].venue.fullName }
  } catch (e) {
    return e.response
  }
}

export async function nextActiveEvent() {
  try {
    const ev = await EventManager.getNextActiveEvent()

    return { ...ev, location: ev.locations[0].venue.fullName }
  } catch (e) {
    return e.response
  }
}

export default { event, events }
