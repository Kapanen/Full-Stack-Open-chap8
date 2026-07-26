const mongoose = require('mongoose')
const config = require('./utils/config')

const Author = require('./models/author')
const Book = require('./models/book')

const authors = require('./data/authors')
const books = require('./data/book')

const seed = async () => {
    await mongoose.connect(config.MONGODB_URI)
        console.log('Connected to MongoDB')

    await Book.deleteMany({})
    await Author.deleteMany({})   
    
    console.log('Database cleared')

    const authorMap = new Map()

    for (const author of authors) {
        const savedAuthor = await new Author(author).save()

        authorMap.set(savedAuthor.name, savedAuthor)

        console.log(`Added author: ${savedAuthor.name}`)
        }

    for (const book of books) {
        const author = authorMap.get(book.author)

        const newBook = new Book({
            title: book.title,
            published: book.published,
            author: author._id,
            genres: book.genres,
        })

        await newBook.save()

        console.log(`Added book: ${newBook.title}`)
        }
        
    await mongoose.connection.close()
    console.log('closed')
}

seed()