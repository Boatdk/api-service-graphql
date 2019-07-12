import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import schema from './modules/rootSchema'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

const app = express()

app.get('/', (req, res) => {
    res.send("You can user this server API")
    
})

app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({ schema })))
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}))

mongoose.Promise = global.Promise
const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-y1ybk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(url)
  .then(()=> {
    console.log("connect to mongoDB success");
    app.listen(4000);
  }).catch(err => {
    console.log(err);
  })
