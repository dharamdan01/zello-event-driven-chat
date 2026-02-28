import { useState } from 'react'

export default function AuthScreen({ onContinue, isLoading }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const value = e.target.value
    const alphabetOnly = value.replace(/[^a-zA-Z\s]/g, '')
    setName(alphabetOnly)
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setError('Only alphabetic characters are allowed')
      return
    }

    onContinue(name)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <h1 className="auth-title">Enter your name</h1>
          <p className="auth-description">Join our real-time chat community</p>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <input
                type="text"
                className={`auth-input ${error ? 'auth-input-error' : ''}`}
                placeholder="Your name (e.g. John Doe)"
                value={name}
                onChange={handleInputChange}
                disabled={isLoading}
                autoFocus
              />
              {error && <span className="auth-error-text">{error}</span>}
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
