import React from 'react'
import './styles/App.css'

import { ConnectToWallet } from './components/ConnectToWallet'
import { MyWallet } from './components/MyWallet'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ConnectToWallet />
        <MyWallet />
      </header>
    </div>
  )
}

export default App
