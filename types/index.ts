const { gql } = require('apollo-server')

const typeDefs = gql`
  type Event {
    id: ID!
    name: String
    startDate: String
    endDate: String
    status: String
    leaderboard: Leaderboard
    athlete: Player
    purse: String
    location: String
    isMajor: Boolean
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
    citizenship: String
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

  type Ranking {
    firstName: String!
    lastName: String!
    points: Float!
    projectedPoints: Float
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
    event(id: String!): Event
    bets: [Bet]
    bet(userId: String!, eventId: String!): Bet
    projected(eventId: String!): [Ranking]
  }

  type Mutation {
    createBet(userId: String, eventId: String, players: [PlayersInput]): Bet
    login(loginData: LoginInput): User
    register(registerData: RegisterInput): User
    verify(token: String): Boolean
    forgot(email: String): Boolean
    resetPassword(token: String, password: String): Boolean
  }
`

export default typeDefs
