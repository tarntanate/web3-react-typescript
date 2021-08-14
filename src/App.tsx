import React from 'react'
import './styles/App.css'

import { ConnectToWallet } from './components/ConnectToWallet'
import { Wallet } from './components/Wallet'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ConnectToWallet />
        <Wallet />
      </header>
    </div>
  )
}

export default App
