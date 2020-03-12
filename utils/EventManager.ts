import {} from 'date-fns'
import axios from 'axios'

// Singleton to access events
class EventManager {
  events: any[]
  constructor() {
    this.events = []
  }

  async getEvents() {
    try {
      if (this.events.length) return this.events

      const { data } = await axios.get(process.env.SCHEDULE_ENDPOINT || '')

      this.events = data.events.map((event: any) => {
        const id = event.link.split('=')[1]

        return {
          id,
          ...event,
        }
      })

      return this.events
    } catch (e) {
      console.error(e)

      throw e
    }
  }

  async getActiveEvent() {
    try {
      const eventList = await this.getEvents()
      if (!eventList.length) return null

      for (let ev of eventList) {
        const now = Date.now()
        const start = new Date(ev.startDate).getTime()
        const end = new Date(ev.endDate).getTime()
        if (now < end && now > start) {
          return ev
        }
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export default new EventManager()
