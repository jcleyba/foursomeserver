import axios from 'axios'
import isThisWeek from 'date-fns/isThisWeek'

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

      return e
    }
  }

  async getActiveEvent() {
    try {
      const eventList = await this.getEvents()
      if (!eventList.length) return null

      return eventList.find((item: any) => isThisWeek(new Date(item.startDate)))
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async getLastActiveEvent() {
    try {
      const eventList = await this.getEvents()
      if (!eventList.length) return null

      const index = eventList.findIndex((item: any) => item.status !== 'post')

      return eventList[index - 1]
    } catch (e) {
      console.error(e)
      return e
    }
  }
}

export default new EventManager()
