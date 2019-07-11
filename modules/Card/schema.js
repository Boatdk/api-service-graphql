import {
  createCardService,
  updateCardService,
  findCardById,
  getCardService,
  deleteCardService
} from './services'


const query = `
  cards(input: SearchCardInput): CardsPayload
  findCard(input: FindCardByIdInput): CardsPayload
`
const mutation = `
  createCard(input: CreateCardInput!): CardsPayload
  updateCard(input: UpdateCardInput!): CardsPayload
  deleteCard(input: DeleteCardInput!): CardsPayload
`

const typeDefinitions = `
  input SearchCardInput {
    keyword: String
    per_page: Int
    current_page: Int
  }

  input CreateCardInput {
    card: CardData
  }

  input UpdateCardInput {
    _id: ID
    card: CardData
  }

  input FindCardByIdInput {
    _id: ID
  }

  input DeleteCardInput {
    _id: ID
  }

  input CardData {
    name: String
    description: String
    price: [Int]
  }

  type CardsPayload {
    meta: Meta
    data: [Card]
    errors: [Error]
  }


  type Card {
    _id: ID
    name: String
    description: String
    price: [Int]
    create_at: String
    update_at: String
  }

`

const resolvers = {
  Query: {
    cards(root, args) {
      return new Promise((resolve, reject) => {
        getCardService(args, (data) => {
          resolve(data)
        })
      })
    },
    findCard(root, args) {
      return new Promise((resolve, reject) => {
        findCardById(args, (data) => {
          resolve(data)
        })
      })
    }
  },
  Mutation: {
    createCard(root, args) {
      return new Promise((resolve, reject) => {
        createCardService(args, (data) => {
          resolve(data)
        })
      })
    },
    updateCard(root, args) {
      return new Promise((resolve, reject) => {
        updateCardService(args, (data) => {
          resolve(data)
        })
      })
    },
    deleteCard(root, args) {
      return new Promise((resolve, reject) => {
        deleteCardService(args, (data) => {
          resolve(data)
        })
      })
    }
  }
}

export {
  query,
  typeDefinitions,
  mutation,
  resolvers
}