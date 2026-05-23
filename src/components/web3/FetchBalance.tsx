import { useEffect, useState } from 'react';
import axios from 'axios';
import type { WalletChain } from '@soroban-react/types';
import { HStack } from '@chakra-ui/react';

interface FetchBalanceProps {
  address: string;
  activeChain: WalletChain | undefined;
}

export const FetchBalance = ({ address, activeChain }: FetchBalanceProps) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        let response;
        if (activeChain?.name === 'Futurenet') {
          response = await axios.get(`https://horizon-futurenet.stellar.org/accounts/${address}`);
        } else if (activeChain?.name === 'Testnet') {
          response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${address}`);
        } else {
          throw new Error('Unsupported chain name');
        }
        const nativeBalance = response.data.balances?.find((balance: { asset_type: string; }) => balance.asset_type === 'native');
        setBalance(nativeBalance?.balance || '0.00');
      } catch (error) {
        console.error('Error fetching Stellar balance:', error);
      }
    };

    fetchBalance();
  }, [address, activeChain]);

  return (
    <HStack>
      <div className='text-black mr-3'>
        <p className="text-2xl">Balance:</p>
        <p>XLM {balance.slice(0, 5)}</p>
      </div>
    </HStack>
  );
};