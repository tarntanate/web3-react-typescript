import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatEther } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export const Wallet = () => {
  const { chainId, account, library } = useWeb3React()
  const [balance, setBalance] = React.useState<BigNumber | null>(null)
  
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })

      return () => {
        stale = true
        setBalance(null)
      }
    }
  }, [account, library, chainId]) 

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account Address: {account}</div>
      <div>Balance: {balance ? formatEther(balance) : "0"}</div>
    </div>
  );
};
