import { useEffect, useRef, useState } from 'react'
import './App.css'
import { connectWS } from './ws';
import Header from './components/Header'
import AuthScreen from './components/AuthScreen'
import ChatScreen from './components/ChatScreen'

export default function App() {

  const socket = useRef(null);

  const [userName, setUserName] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.current = connectWS();

    socket.current.on('connect', () => {

      socket.current.emit('userJoined', userName);


    })
  }, [])

  const handleContinue = (name) => {
    setIsLoading(true)
    if (socket.current) {
      socket.current.emit('setUserName', name)
    }
    setTimeout(() => {
      setIsLoading(false)
      setUserName(name)
      setIsAuthenticated(true)
      if (socket.current) {
        socket.current.emit('joinRoom', name);
      }
    }, 500);
  }

  return (
    <>
      <Header />
      {!isAuthenticated ? (

        <AuthScreen onContinue={handleContinue} isLoading={isLoading} />
      ) : (
        
        <ChatScreen userName={userName} socket={socket.current} />
      )}
    </>
  )
}
