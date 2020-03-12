require('dotenv').config()

import { ApolloServer, AuthenticationError } from 'apollo-server'
import typeDefs from './types'
import resolvers from './resolvers'
import { getUser } from './utils/user'

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
      throw new AuthenticationError('you must be logged in')
    }
  },
})
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
