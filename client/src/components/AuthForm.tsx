import { useState, useEffect } from 'react'
import socket from './socket.tsx'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

interface AuthFormProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

function AuthForm({ setAuthenticated }: AuthFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [action, setAction] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'username') {
      setUsername(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const handleConfirmDelete = () => {
    if (deletePassword !== password) {
      alert('Incorrect password. Account deletion cancelled.')
      setConfirmDelete(false)
      return
    }

    
    socket.emit('delete_account', { username }, ({ success }: { success: boolean }) => {
      if (success) {
        alert(`User ${username} deleted successfully`)
        
      } else {
        console.error('Error deleting account')
        
      }
      setConfirmDelete(false)
    })
  }

  const handleAction = (event: React.FormEvent) => {
    event.preventDefault()

    if (!username || !password) {
      alert('Please enter both username and password')
      return
    }

    if (action === 'signup') {
      
      const id = uuidv4()

      try {
        
        socket.emit('check_username', { username }, (response: boolean) => {
          if (response) {
            alert('Username already exists')
            return
          }

          
          socket.emit('create_user', { username, password, id }, ({ success }: { success: boolean }) => {
            if (success) {
              console.log('Signed up as:', username)
              setAuthenticated(true)
            } else {
              console.error('Error creating user')
              
            }
          })
        })
      } catch (error) {
        console.error('Error:', error)
      }
    } else if (action === 'login') {
      
      try {
        
        socket.emit('check_username', { username }, (response: boolean) => {
          if (!response) {
            alert('Username does not exist')
            return
          }

          
          socket.emit('check_password', { username, password, purpose: 'login' }, ({ success, reason }: { success: boolean, reason?: string }) => {
            if (success) {
              console.log('Logged in as:', username)
              setAuthenticated(true)
            } else {
              alert(reason)
              return
            }
          })
        })
      } catch (error) {
        console.error('Error:', error)
      }
    } else if (action === 'delete') {
      
      socket.emit('check_username', { username }, (response: boolean) => {
        if (!response) {
          alert('Username does not exist')
          return
        }

        
        socket.emit('check_password', { username, password, purpose: 'delete' }, ({ success, reason }: { success: boolean, reason?: string }) => {
          if (success) {
            setConfirmDelete(true)
          } else {
            alert(reason)
            return
          }
        })
      })
    }
  }

  useEffect(() => {
    
    socket.on('connected_users', (users: string[]) => {
      setConnectedUsers(users)
    })

    
    return () => {
      socket.off('connected_users')
    }
  }, [])

  return (
    <div>
      <h2>Log In / Sign Up</h2>
      {confirmDelete ? (
        <div>
          <h3>Confirm Account Deletion</h3>
          <label>
            Password:
            <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
          </label>
          <button className="delete-button" type="button" onClick={handleConfirmDelete}>
            Confirm Deletion
          </button>
        </div>
      ) : (
        <form onSubmit={handleAction}>
          <label>
            Username:
            <input type="text" name="username" value={username} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={password} onChange={handleInputChange} />
          </label>
          <br />
          <button type="submit" onClick={() => setAction('signup')}>
            Sign Up
          </button>
          <button type="submit" onClick={() => setAction('login')}>
            Log In
          </button>
          <button className="delete-button" type="submit" onClick={() => setAction('delete')}>
            Delete Account
          </button>
        </form>
      )}
      <div className="connected-users">
        <h2>Connected Users</h2>
        <ul>
          {connectedUsers.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AuthForm
