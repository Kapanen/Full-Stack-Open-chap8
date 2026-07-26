const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const mongoose = require('mongoose')
const config = require('./utils/config')

const Author = require('./models/author')
const Book = require('./models/book')


/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */



/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    authorsCount: Int!
    allAuthors: [Author!]!
    booksCount: Int!
    allBooks (author: String, genre: String): [Book!]!
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }

`
const { v1: uuid } = require("uuid")

const resolvers = {
  Query: {
    authorsCount: async () => {
        return await Author.countDocuments()
      },
    allAuthors: async () => {
        return await Author.find({})
      },
    booksCount: () => books.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return books
      }
      return books.filter(book => {
        if (args.author && book.author !== args.author) {
          return false
        }
        if (args.genre && !book.genres.includes(args.genre)) {
          return false
        }
        return true
      })
    },
  },

  Author: {
    bookCount : (root) => {
      return books.filter(book => book.author === root.name).length
    }
  },

  Mutation: {
    addBook: (root, args) => {
      let author = authors.find(a => a.name === args.author)

      if (!author) {
        author = {
          name: args.author,
          id: uuid(),
          born: null
        }
      
      authors = authors.concat(author)
      }

      const book = { ...args, id: uuid() }
      books = books.concat(book)
      return book
    },
    editAuthor: (root, args ) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      author.name = args.name
      return author
    }
  }


}

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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
