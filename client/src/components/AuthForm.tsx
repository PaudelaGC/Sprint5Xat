import React, { useState } from 'react'
import socket from './socket.tsx'
import { v4 as uuidv4 } from 'uuid'
interface AuthFormProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthForm: React.FC<AuthFormProps> = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true) // New state to track if it's Sign Up or Log In

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!username || !password) {
      alert('Please enter both username and password')
      return
    }

    const id = uuidv4() // Generate a unique ID using uuidv4()

    try {
      if (isSignUp) {
        // Check if the username already exists
        socket.emit('check_username', { username }, (response: boolean) => {
          if (response) {
            alert('Username already exists')
            return
          }

          // Create a new user using socket.io
          socket.emit('create_user', { username, password, id }, ({ success }: { success: boolean }) => {
            if (success) {
              console.log('Signed up as:', username) // Log the username
              setAuthenticated(true)
            } else {
              console.error('Error creating user')
              // Handle the error
            }
          })
        })
      } else {
        // Log In functionality
        // Check if the username exists
        socket.emit('check_username', { username }, (response: boolean) => {
          if (!response) {
            alert('Username does not exist')
            return
          }

          // Check if password matches
          socket.emit('check_password', { username, password }, ({ success }: { success: boolean }) => {
            if (success) {
              console.log('Logged in as:', username) // Log the username
              setAuthenticated(true)
            } else {
              alert('Password is not valid')
              return
            }
          })
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button onClick={toggleSignUp}>
        {isSignUp ? 'Log In with existing account' : 'Create new account'}
      </button>
    </div>
  )
}

export default AuthForm

