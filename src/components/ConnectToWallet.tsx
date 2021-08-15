import React, { useEffect, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useEagerConnect } from "../hooks/useEagerConnect";
import { useInactiveListener } from "../hooks/useInactiveListener";
import { injected } from '../utils/connectors';

export const ConnectToWallet = () => {
  // handle logic to recognize the connector currently being activated
  const { connector, activate, error, chainId } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = useState<any>(null);
  const triedEager = useEagerConnect();
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;

  console.debug('tried', triedEager);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      console.debug('activating...');
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    // // A Web3Provider wraps a standard Web3 provider, which is
    // // what Metamask injects as window.ethereum into each page
    // declare const window: any
    // const provider = new ethers.providers.Web3Provider(window.ethereum ?? null)
    // // console.debug(provider)
    // // The Metamask plugin also allows signing transactions to
    // // send ether and pay to change state within the blockchain.
    // // For this, you need the account signer...
    // const signer = provider.getSigner()
    // console.debug(signer)
    // const test = async () => {
    //   // Look up the current block number
    //   let blockNumber = await provider.getBlockNumber()
    //   // 12994935
    //   console.debug(blockNumber)
    //   let myWalletAddresses = await provider.listAccounts()
    //   console.debug(myWalletAddresses)
    //   // Get the balance of an account (by address or ENS name, if supported by network)
    //   let balance = await provider.getBalance(myWalletAddresses[0])
    //   // { BigNumber: "2337132817842795605" }
    //   console.debug(balance)
    //   // Often you need to format the output to something more user-friendly,
    //   // such as in ether (instead of wei)
    //   console.debug(ethers.utils.formatEther(balance))
    //   // '2.337132817842795605'
    //   let transactionCount = await provider.getTransactionCount(myWalletAddresses[0])
    //   // let etherPrice = await provider.getEtherPrice()
    //   let gasPrice = await provider.getGasPrice()
    //   console.debug(transactionCount)
    //   console.debug(ethers.utils.formatEther(gasPrice))
    // }
    // test()
  }, []);

  if (isUnsupportedChainIdError)
    return <div>Error: Unsupported chain Id!!</div>;

  const currentConnector = injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  // const disabled = !triedEager || !!activatingConnector || connected || !!error
  // console.log('error', error);
  // console.log('connected', connected);
  // console.log('connect', connect);
  // console.log('activating', activating);

  return (
    <button
      style={{
        height: '3rem',
        borderRadius: '0.5rem',
        // borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
        position: 'relative',
      }}
      disabled={connected || !!error}
      onClick={() => {
        setActivatingConnector(currentConnector);
        activate(injected);
      }}
    >
      {connected ? `Connected to wallet [chainId: ${chainId}]` : 'Connect wallet via Injected Connector'}
    </button>
  );
};
