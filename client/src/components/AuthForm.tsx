import React, { useState } from 'react'
import socket from './socket.tsx'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

interface AuthFormProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthForm: React.FC<AuthFormProps> = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [action, setAction] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'username') {
      setUsername(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const handleAction = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!username || !password) {
      alert('Please enter both username and password')
      return
    }

    if (action === 'signup') {
      // Handle sign up logic
      const id = uuidv4()

      try {
        // Check if the username already exists
        socket.emit('check_username', { username }, (response: boolean) => {
          if (response) {
            alert('Username already exists')
            return
          }

          // Create a new user using socket.io
          socket.emit('create_user', { username, password, id }, ({ success }: { success: boolean }) => {
            if (success) {
              console.log('Signed up as:', username)
              setAuthenticated(true)
            } else {
              console.error('Error creating user')
              // Handle the error
            }
          })
        })
      } catch (error) {
        console.error('Error:', error)
      }
    } else if (action === 'login') {
      // Handle log in logic
      try {
        // Check if the username exists
        socket.emit('check_username', { username }, (response: boolean) => {
          if (!response) {
            alert('Username does not exist')
            return
          }

          // Check if password matches
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
      // Check if the username exists
      socket.emit('check_username', { username }, (response: boolean) => {
        if (!response) {
          alert('Username does not exist')
          return
        }
  
        // Check if password matches
        socket.emit('check_password', { username, password, purpose: 'delete' }, ({ success, reason }: { success: boolean, reason?: string }) => {
          if (success) {
            // Password is correct, proceed with account deletion
            const confirmDelete = prompt('To delete your account, please enter your password:')
            if (confirmDelete !== password) {
              alert('Incorrect password. Account deletion cancelled.')
              return
            }
            // Delete user account
            socket.emit('delete_account', { username }, ({ success }: { success: boolean }) => {
              if (success) {
                console.log('Account deleted:', username)
                // Update UI or perform other actions upon successful deletion
              } else {
                console.error('Error deleting account')
                // Handle the error
              }
            })
          } else {
            alert(reason)
            return
          }
        })
      })
    }
  }

  return (
    <div>
      <h2>Log In / Sign Up</h2>
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
    </div>
  )
}

export default AuthForm
