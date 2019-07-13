import {
  getDataService
} from './services'

const query = `
    pages: PagesPayload
`

const typeDefinitions = `
    type PagesPayload {
        meta: Meta
        data: [Page]
        errors: [Error]
    }

    type Page {
      game: [String],
      
    }
`

const resolvers = {
  Query: {
    pages(root, args) {
      return new Promise((resolve, reject) => {
        getDataService(args, (data) => {
          resolve(data)
        })
      })
    }
  }
}

export {
  query,
  typeDefinitions,
  resolvers
}