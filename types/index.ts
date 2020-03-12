const { gql } = require('apollo-server')

const typeDefs = gql`
  type Event {
    id: ID!
    name: String
    startDate: String
    endDate: String
    leaderboard: Leaderboard
  }

  type Leaderboard {
    status: String
    players: [Player]
  }

  type Player {
    id: ID!
    name: String
    pos: String
    score: String
    img: String
    flag: String
  }
  type Bet {
    userId: String!
    eventId: String!
    players: [Player]
    season: Int
    result: Float
  }

  input PlayersInput {
    id: ID!
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    token: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Query {
    events: [Event]
    event(id: String): Event
    bets: [Bet]
    bet(userId: String, eventId: String): Bet
  }

  type Mutation {
    createBet(userId: String, eventId: String, players: [PlayersInput]): Bet
    login(loginData: LoginInput): User
    register(registerData: RegisterInput): User
  }
`

export default typeDefs
