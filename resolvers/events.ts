const axios = require('axios')

export async function events() {
  try {
    const { data } = await axios.get(
      'https://www.espn.com/golf/schedule/_/season/2020?_xhr=pageContent'
    )

    return data.events.map((event: any) => {
      const id = event.link.split('=')[1]

      return {
        id,
        ...event,
      }
    })
  } catch (e) {
    return e.response
  }
}

export async function event(_: any, args: Record<string, unknown>) {
  const { id } = args
  if (!id) throw Error('Id is missing')
  try {
    const { data } = await axios.get(
      'https://www.espn.com/golf/leaderboard?_xhr=pageContent&tournamentId=' +
        id
    )

    return {
      id: data.leaderboard.id,
      name: data.leaderboard.name,
      leaderboard: {
        ...data.leaderboard,
        players: data.leaderboard.competitors
          .sort((a: any, b: any) => a.order - b.order)
          .map((player: Record<string, unknown>) => ({
            ...player,
            score: player.toPar,
          })),
      },
    }
  } catch (e) {
    throw Error(e.response.message)
  }
}

export default { event, events }
