import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from './quaries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS }
    ]
  })

  if (!props.show) {
    return null
  }


  const submit = async (event) => {
    event.preventDefault()

    const submittedGenres = genre ? genres.concat(genre) : genres

    console.log('add book...')
    try {
      await addBook({
        variables: {
          title,
          author,
          published: Number(published),
          genres: submittedGenres
        }
      })

      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
    } catch (error) {
      console.log(error)
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
        </label>
        </div>
        
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
            <button onClick={addGenre} type="button">
              add genre
            </button>
          <div>genres: {genres.join(' ')}</div>
          <button type="submit">create book</button>
        </div>
      </form>
    </div>
  )
}

export default NewBook
