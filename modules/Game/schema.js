import {
  getGameService,
  createGameService,
  updateGameService,
  findGameById,
  deleteGameService
} from './services'

const query = `
  games(input: SearchGameInput): GamesPayload
  findGame(input: FindGameByIdInput): GamesPayload
`

const mutation = `
  createGame(input: CreateGameInput!): GamesPayload
  updateGame(input: UpdateGameInput!): GamesPayload 
  deleteGame(input: DeleteGameInput!): GamesPayload
`

const typeDefinitions = `
  input SearchGameInput {
    keyword: String
    per_page: Int
    current_page: Int
  }

  input FindGameByIdInput {
    _id: ID
  }

  input CreateGameInput {
    game: GameData
  }

  input UpdateGameInput {
    _id: ID
    game: GameData
  }

  input DeleteGameInput {
    _id: ID
  }

  input GameData {
   title: String
   shortname: String
   description: String
   link: String
   picture_path: String
  }
  # แสดงผลลัพท์ของ Game
  type GamesPayload {
    meta: Meta
    data: [Game]
    errors: [Error]
  }
  
  type Game {
    _id: ID
    title: String
    shortname: String
    description: String
    link: String
    picture_path: String
    created_at: String
    updated_at: String
  }
  # แสดงข้อมูลจิปาถะ(มั้งนะ >3<)
  type Meta {
    status: Int
    message: String
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
  }
  # แสดง Errors
  type Error {
    code: Int
    message: String
  }
`

const resolvers = {
  Query: {
    games(root, args) {
      return new Promise((resolve, reject) => {
        getGameService(args, (data) => {
          resolve(data)
        })
      })
    },
    findGame(root, args) {
      return new Promise((resolve, reject) => {
        findGameById(args, (data) => {
          resolve(data)
        })
      })
    },
  },
  Mutation: {
    createGame(root, args) {
      return new Promise((resolve, reject) => {
        createGameService(args, (data) => {
          resolve(data)
        })
      })
    },
    updateGame(root, args, params) {
      return new Promise((resolve, reject) => {
        updateGameService(args, (data) => {
          resolve(data)
        })
      })
    },
    deleteGame(root, args) {
      return new Promise((resolve, reject) => {
        deleteGameService(args, (data) => {
          resolve(data)
        })
      })
    },
  },
}

export {
  query,
  typeDefinitions,
  mutation,
  resolvers,
}