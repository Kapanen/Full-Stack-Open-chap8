import {useQuery, useMutation} from '@apollo/client/react'
import {ALL_AUTHORS, EDIT_AUTHOR} from './quaries'
import { useState, useEffect } from 'react'

const Authors = ({show}) => {
  const {loading,error, data} = useQuery(ALL_AUTHORS)

  const [name, setName] = useState('')
  const [born, setBorn] =useState('')
  
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
      refetchQueries: [
        { query: ALL_AUTHORS }
      ]
    })

  const authors = data?.allAuthors ?? []

  useEffect(() => {
    if (authors.length > 0 && name === '') {
      setName(authors[0].name)
    }
  }, [authors, name])

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading.</div>
  }

  if (error) {
    console.log(error)
    return <div>error</div>
  }



 

  const submit = async (event) => {
  event.preventDefault()

  await editAuthor({
    variables: {
      name,
      setBornTo: Number(born)
    }
  })

  setBorn('')
}

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
        <form onSubmit={submit}>
          <div>
            <label>
              Name
              <select
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map(author => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </label>
          </div>

          <button type="submit">update author</button>
        </form>
    </div>
  )
}

export default Authors
