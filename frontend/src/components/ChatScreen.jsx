import { useEffect, useState } from 'react'
export default function ChatScreen({ userName, socket }) {
  const [allMessages, setAllMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState({isTyping: false, userName: ""})
  
  useEffect(() => {
    if (socket) {
      socket.on('sendChatMessage', (data) => {
        setAllMessages((prev) => [...prev, {
          id: Date.now(),
          type: 'regular',
          sender: data.sender,
          message: data.message,
          timestamp: data.timestamp,
          order: Date.now()
        }]);
      })
      socket.on('typing', (data) => {
        if (data.userName !== userName) {
          console.log(`${data.userName} is typing...`);
          setIsTyping({isTyping: true, userName: data.userName});
          setTimeout(() => setIsTyping(false), 1000);
        }
      })
      socket.on('userJoined', (data) => {
        console.log(data.userName, "joined the group.");
        const truncatedName = data.userName.length > 10 ? data.userName.substring(0, 10) : data.userName
        const systemMessage = {
          id: Date.now(),
          type: 'system',
          text: `${truncatedName} joined the group`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          order: Date.now()
        }
        setAllMessages(prev => [...prev, systemMessage])
      })
    }
    return () => {
      if (socket) {
        socket.off('sendChatMessage')
        socket.off('typing')
        socket.off('userJoined')
      }
    }
  }, [socket, userName])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) {
      return
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const message = {
      sender: userName,
      message: inputValue.trim(),
      timestamp: timestamp
    }

    if (socket) {
      setAllMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'regular',
        sender: userName,
        message: inputValue.trim(),
        timestamp: timestamp,
        order: Date.now()
      }])
      socket.emit('sendChatMessage', message)
    }

    setInputValue('')
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (socket) {
      socket.emit('typing', { userName })
    }
  }

  const getAvatarLetter = (name) => {
    return name.charAt(0).toUpperCase()
  }

  const truncateUserName = (name) => {
    return name.length > 10 ? name.substring(0, 10) : name
  }

  const sanitizeText = (text) => {

    let sanitized = text.trim()
    

    sanitized = sanitized.replace(/\s+/g, ' ')
    

    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
    
    return sanitized
  }

  const validateMessageLength = (text) => {
    const minLength = 1
    const maxLength = 500
    const trimmedText = text.trim()
    
    if (trimmedText.length < minLength) {
      return { valid: false, error: 'Message cannot be empty' }
    }
    if (trimmedText.length > maxLength) {
      return { valid: false, error: `Message exceeds maximum length of ${maxLength} characters` }
    }
    return { valid: true, error: null }
  }

  const validateMessageContent = (text) => {

    if (!text || /^\s*$/.test(text)) {
      return { valid: false, error: 'Message cannot contain only whitespace' }
    }
    

    const specialCharCount = (text.match(/[!@#$%^&*()_\-+=\[\]{};:'",.<>?\/\\|`~]/g) || []).length
    if (specialCharCount > text.length * 0.5) {
      return { valid: false, error: 'Message contains too many special characters' }
    }
    
    return { valid: true, error: null }
  }

  const validateMessage = (text) => {

    const lengthValidation = validateMessageLength(text)
    if (!lengthValidation.valid) {
      return lengthValidation
    }
    

    const contentValidation = validateMessageContent(text)
    if (!contentValidation.valid) {
      return contentValidation
    }
    
    return { valid: true, error: null }
  }

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="avatar">
              {getAvatarLetter(userName)}
            </div>
            <div className="chat-header-info">
              <h1 className="chat-title">Zello Group Chat</h1>
              <p className={`chat-subtitle ${isTyping.isTyping ? 'typing-active' : ''}`}>
                {isTyping.isTyping ? `${isTyping.userName} is typing...` : 'Ready to chat'}
              </p>
            </div>
          </div>
          <div className="chat-header-right">
            <span className="signed-in-text">Signed in as {truncateUserName(userName)}</span>
          </div>
        </div>

        <div className="chat-messages">
          {allMessages.length === 0 ? (
            <div className="empty-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            allMessages.map(msg => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="system-message">
                    <div className="system-message-label">
                      <p className="system-message-text">{msg.text}</p>
                      <span className="system-message-time">{msg.timestamp}</span>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={msg.id} className={`message ${msg.sender === userName ? 'own-message' : 'other-message'}`}>
                    <div className="message-avatar">
                      {getAvatarLetter(msg.sender)}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </div>
                  </div>
                )
              }
            })
          )}
        </div>

        <form className="chat-input-section" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message…"
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <button
            type="submit"
            className="send-button"
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}