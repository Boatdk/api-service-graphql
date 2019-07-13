import {
  getSerialService,
  createSerialService,
  updateSerialService,
  deleteSerialService
} from './services'

const query = `
  serials(input: SearchSerialInput): SerialsPayload
`
const mutation = `
  createSerial(input: CreateSerialInput!): SerialsPayload  
  updateSerial(input: UpdateSerialInput!): SerialsPayload
  deleteSerial(input: DeleteSerialInput!): SerialsPayload
`

const typeDefinitions = `
  input SearchSerialInput {
    keyword: String
    per_page: Int
    current_page: Int
  }

  input CreateSerialInput{
    serial: SerialData
  }

  input UpdateSerialInput {
    _id: ID
    serial: SerialData
  }

  input DeleteSerialInput {
    _id: ID
  }

  input SerialData {
    serial: String
    pin: String
    price: Int
  }

  type SerialsPayload {
    meta: Meta
    data: [Serial]
    errors: [Error]
  }

  type Serial {
    _id: ID
    serial: String
    pin: String
    price: Int
    create_at: String
    update_at: String
  }
`

const resolvers = {
  Query: {
    serials(root, args) {
      return new Promise((resolve, reject) => {
        getSerialService(args, (data) => {
          resolve(data)
        })
      })
    }
  },
  Mutation: {
    createSerial(root, args) {
      return new Promise((resolve, reject) => {
        createSerialService(args, (data) => {
          resolve(data)
        })
      })
    },
    updateSerial(root, args) {
      return new Promise((resolve, reject) => {
        updateSerialService(args, (data) => {
          resolve(data)
        })
      })
    },
    deleteSerial(root, args) {
      return new Promise((resolve, reject) => {
        deleteSerialService(args, (data) => {
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