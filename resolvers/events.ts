import axios from 'axios'
import EventManager from '../utils/EventManager'

export async function events() {
  try {
    const events = await EventManager.getEvents()

    return events.map(ev => {
      return { ...ev, location: ev.locations[0].venue.fullName }
    })
  } catch (e) {
    return e.response
  }
}

export async function event(_: any, args: Record<string, unknown>) {
  const { id: eventId } = args
  if (!eventId) throw Error('Id is missing')
  try {
    const url = `${process.env.LEADERBOARD_ENDPOINT || ''}${eventId}`
    const { data } = await axios.get(url)
    const { leaderboard } = data
    const { id, name, competitors, status } = leaderboard

    return {
      id,
      name,
      status,
      leaderboard: {
        ...leaderboard,
        players: competitors
          .sort((a: any, b: any) => a.order - b.order)
          .map((player: Record<string, unknown>) => ({
            ...player,
            score: player.toPar,
          })),
      },
    }
  } catch (e) {
    throw e
  }
}

export default { event, events }
