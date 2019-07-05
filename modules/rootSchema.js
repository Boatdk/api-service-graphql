import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash.merge'
import {
  query as gameQuery,
  resolvers as gameResolvers,
  typeDefinitions as gameTypes,
  mutation as gameMutation,
} from './Game/schema'

const moduleQueries = [
  gameQuery,
]

const moduleTypeDefinitions = [
  gameTypes,
]

const moduleMutations = [
  gameMutation,
]

const schema = `
  # Root Query
  type Query {
    ${moduleQueries.join('\n')}
  }
  ${moduleTypeDefinitions.join('\n')}
  # All Mutation services
  type Mutation {
    ${moduleMutations.join('\n')}
  }
  # GraphQL Document
  schema {
    query: Query
    mutation: Mutation
  }
`

const resolvers = merge(gameResolvers)
const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
})

export default executableSchema