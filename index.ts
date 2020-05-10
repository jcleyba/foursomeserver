require('dotenv').config()

import { ApolloServer, AuthenticationError } from 'apollo-server'
import { CronJob } from 'cron'
import typeDefs from './types'
import resolvers from './resolvers'
import { getUser } from './utils/user'
import EventManager from './utils/EventManager'
import { updateResults } from './resolvers/bets'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    try {
      const tokenWithBearer = req.headers.authorization || ''
      const token = tokenWithBearer.split(' ')[1]
      const user = await getUser(token)

      return { user }
    } catch (e) {
      return new AuthenticationError('you must be logged in')
    }
  },
})

//'* 1 0 * * 1'
const job = new CronJob('* 1 0 * * 1', async () => {
  console.log('*** Running job ***')
  try {
    const event = await EventManager.getLastActiveEvent()
    console.log(`*** Event ${event.name} ***`)
    const done = await updateResults(event.id)
    if (done) {
      console.log(`*** Done Updating ***`)
    } else {
      console.log(`*** Somethig went wrong ***`)
    }
  } catch (e) {
    console.log(`ﬁ*** Update failed ${e} ***`)
    console.error(e)
  }
})

job.start()
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
