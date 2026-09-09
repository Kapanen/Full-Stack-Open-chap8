const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const mongoose = require('mongoose')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:')
    console.log(error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET)

      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }

    return {}
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
