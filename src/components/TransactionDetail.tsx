import React, { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import {formatUnits } from 'ethers/lib/utils'
import counterABI from '../abi/Counter.json'

const TransactionDetail: React.FC = () => {
  const { chainId, account, active, library } = useWeb3React()
  const [transactionHash, setTransactionHash] = useState(null)
  const [blockNumber, setBlockNumber] = useState(0)
  const [transaction, setTransaction] = useState(null)
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [hash, setHash] = useState(null)
  const [confirmations, setConfirmations] = useState<any>(null)
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const [counter, setCounter] = useState<BigNumber>(BigNumber.from(0))
  const contractAddress = '0x8F025EC4608E6e9e0d3F907A390c8075a596Bb20'

  const getConfirmations = useCallback(async (txHash: string | null) => {
    if (!txHash) return

    try {
      // Get transaction details
      console.debug("checking confirmation...");
      const trx = await library.getTransaction(txHash)
      setTransaction(trx)

      // Get current block number
      const currentBlock = await library.getBlockNumber()

      console.debug('currentBlock', currentBlock)
      console.debug('trx.blockNumber', trx.blockNumber)

      // When transaction is unconfirmed, its block number is null.
      // In this case we return 0 as number of confirmations
      const numberOfConfirmedBlock = trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
      setConfirmations(numberOfConfirmedBlock)
      setIsConfirmed(numberOfConfirmedBlock >= 2)
      setFrom(trx.from)
      setTo(trx.to)
      setHash(trx.hash)
    } catch (error) {
      console.log(error)
    }
  }, [library])

  const getCounter = useCallback(async () => {
    const contract = new ethers.Contract(contractAddress, counterABI, library.getSigner())
    const value = await contract.getCounter()

    console.debug(value)
    setCounter(value);
  }, [library])

  React.useEffect((): any => {
    // listen for changes on an Ethereum address
    // The events will be depend on which library you're using
    if (active) {
      library.on('block', (value: number) => {
        console.debug("on.'block' event ...", value)
        setBlockNumber(value)
      })
    }
    // remove listener when the component is unmounted (โค้ดตรงนี้ยังไม่ชัวร์)
    return () => {
      if (library.removeListener) {
        console.debug("Removing listener")
        library.removeListener('block')
      }
    }
    // trigger the effect only on component mount
  }, [])

  React.useEffect((): any => {
    if (transactionHash && isConfirmed) {
      alert("Transaction is confirmed!!")
    }

    // Update Counter value
    getCounter()
  }, [transactionHash, isConfirmed, getCounter])

  React.useEffect((): any => {
    // listen for changes on an Ethereum address
    // The events will be depend on which library you're using
    console.debug("Block Number changed");
    // trigger the effect only on component mount
    if (transactionHash != null) {
       getConfirmations(transactionHash)
    }
  }, [blockNumber,  transactionHash, getConfirmations])

  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      if (transactionHash != null) {
        getConfirmations(transactionHash)
      }
      return () => {
        stale = true
        setTransaction(null)
      }
    }
  }, [account, library, chainId, transactionHash, getConfirmations])

  const onIncreaseClick = async () => {
    const contract = new ethers.Contract(contractAddress, counterABI, library.getSigner())
    const transaction = await contract.increase()

    console.debug(transaction)

    setTransaction(transaction)
    setTransactionHash(transaction.hash)
  }

  const onGetCounterClick = async () => {
    await getCounter()
  }

  return (
    <div style={{ fontSize: 16 }}>
      <h2>Transaction Detail</h2>
      <button onClick={onIncreaseClick}>increase</button>
      <div>TX: {transactionHash}</div>
      <div>No. Confirmations Blocked: {confirmations} </div>
      <div>Is Confirmed: {isConfirmed ? 'Yes' : 'No'} </div>
      <div>Transaction From: {from}</div>
      <div>Transaction To: {to}</div>
      <div>Transaction Hash: {hash}</div>
      <button onClick={onGetCounterClick}>get counter</button>
      <h1>Counter: {formatUnits(counter, 0)}</h1>
    </div>
  )
}

export default TransactionDetail
