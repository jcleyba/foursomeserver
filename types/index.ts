const { gql } = require("apollo-server");

const typeDefs = gql`
  type Event {
    id: ID
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
    id: ID
    name: String
    pos: String
    score: String
    img: String
    flag: String
  }
  type Bet {
    userId: String
    eventId: String
    players: [Player]
    result: Float
  }

  input PlayersInput {
    id: ID
  }

  type Query {
    events: [Event]
    event(id: String): Event
    bets: [Bet]
    bet(userId: String, eventId: String): Bet
  }

  type Mutation {
    createBet(userId: String, eventId: String, players: [PlayersInput]): Bet
  }
`;

export default typeDefs;
