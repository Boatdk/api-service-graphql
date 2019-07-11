import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash.merge'
import {
  query as gameQuery,
  resolvers as gameResolvers,
  typeDefinitions as gameTypes,
  mutation as gameMutation,
} from './Game/schema'
import {
  query as cardQuery,
  resolvers as cardResolves,
  typeDefinitions as cardTypes,
  mutation as cardMutation
} from './Card/schema'

const moduleQueries = [
  gameQuery, cardQuery
]

const moduleTypeDefinitions = [
  gameTypes, cardTypes
]

const moduleMutations = [
  gameMutation, cardMutation
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

const resolvers = merge(gameResolvers, cardResolves)
const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
})

export default executableSchema