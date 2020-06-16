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
    season: Int
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
    today: String
    thru: String
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

  type CompositeEvents {
    activeEvent: Event
    nextEvent: Event
  }

  type Query {
    events: [Event]
    compositeEvents: CompositeEvents
    event(id: String!): Event
    activeEvent: Event
    nextActiveEvent: Event
    bets: [Bet]
    bet(eventId: String!): Bet
    projected(eventId: String!): [Ranking]
    ranking: [Ranking]
  }

  type Mutation {
    createBet(eventId: String, players: [PlayersInput], season: Int): Bet
    login(loginData: LoginInput): User
    register(registerData: RegisterInput): User
    verify(token: String!): Boolean
    forgot(email: String!): Boolean
    resetPassword(token: String!, password: String!): Boolean
    updateResults(eventId: String!): Boolean
  }
`

export default typeDefs
