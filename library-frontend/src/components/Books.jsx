import {useQuery} from '@apollo/client/react'
import {ALL_BOOKS} from './quaries'

const Books = ({show}) => {
  const {loading, error, data} = useQuery(ALL_BOOKS)



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

  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
