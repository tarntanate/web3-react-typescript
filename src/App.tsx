import React from 'react'
import { useWeb3React } from '@web3-react/core'
import './styles/App.css'

import { ConnectToWallet } from './components/ConnectToWallet'
import { MyWallet } from './components/MyWallet'
import TransactionDetail from './components/TransactionDetail'

const App = () => {
  const { active } = useWeb3React()
  return (
    <div className="App">
      <header className="App-header">
        <ConnectToWallet />
        {active && (
          <>
            <MyWallet />
            <TransactionDetail />
          </>
        )}
      </header>
    </div>
  )
}

export default App
