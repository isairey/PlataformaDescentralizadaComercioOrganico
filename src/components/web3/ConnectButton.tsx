import 'twin.macro'
import {useSorobanReact} from "@soroban-react/core";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react'
import { FiChevronDown } from 'react-icons/fi'
import { AiOutlineDisconnect } from 'react-icons/ai'
import toast from 'react-hot-toast'
import type { WalletChain } from '@soroban-react/types'
import { useEffect, useState } from 'react'
import { FetchBalance } from './FetchBalance';
import { Stack } from 'react-bootstrap';

export const ConnectButton = () => {
  const [account, setAccount] = useState<string>("");

    // Connect Button
    const sorobanContext = useSorobanReact();


    const {activeChain, address, disconnect, setActiveConnectorAndConnect, setActiveChain} = sorobanContext;
    

    const browserWallets = sorobanContext.connectors;
    const supportedChains = sorobanContext.chains;

  const handleContractInteraction = (chain: WalletChain) => {
    if (!chain.name || chain.name.toLowerCase() === 'standalone') {
      toast.error('Please deploy the contract before proceeding when using the standalone chain..');
    } else {
      setActiveChain && setActiveChain(chain);
      toast.success(`Active chain changed to ${chain.name}`);
    }
   
  };

  useEffect(() => {
    if (address) {
      const address_trimmed = `${address.slice(0, 4)}...${address.slice(-4)}`;
      setAccount(address_trimmed);
    }
  }, [address]);

    if (!address)
      return (
        <Menu>
          <MenuButton
            as={Button}
            // isLoading={isConnecting}
            size="md"
            rightIcon={<FiChevronDown size={22} />}
            py={6}
            fontWeight="bold"
            rounded="2xl"
            colorScheme="purple"
          >
            Connect Wallet
          </MenuButton>

          <MenuList bgColor="blackAlpha.900" borderColor="whiteAlpha.300" rounded="2xl">
            {/* Installed Wallets */}
            {!address &&
              browserWallets.map((w) => 
                  <MenuItem
                    key={w.name}
                    onClick={() => {
                      if (setActiveConnectorAndConnect) {
                        setActiveConnectorAndConnect(w);
                      }
                    }}
                    
                    tw="bg-black text-white hocus:bg-gray-800"
                  >
                    {w.name}
                  </MenuItem>
              )}
          </MenuList>
        </Menu>
      )
   

    // Account Menu & Disconnect Button
    return (
      <Menu>
        <HStack>
          {/* Account Name, Address, and AZNS-Domain (if assigned) */}
          <MenuButton
            as={Button}
            rightIcon={<FiChevronDown size={22} />}
            hidden={false}
            py={6}
            pl={5}
            rounded="2xl"
            fontWeight="bold"
          >
            <Stack direction='vertical'>
              {/* <AccountName account={activeAccount} /> */}
              <p className='text-black text-xl text-left'>{activeChain?.name}</p>
              <p className="text-black text-xl truncate w-[150px] hover:bg-green-200 active: bg-green-500">
              {account}
              </p>
            </Stack>
          </MenuButton>
        </HStack>
        <Stack direction='horizontal' gap={1}>
          <FetchBalance address={address} activeChain={activeChain}/>
            </Stack>
        <MenuList
          bgColor="blackAlpha.900"
          borderColor="whiteAlpha.300"
          rounded="2xl"
          maxHeight="40vh"
          overflow="scroll"
        >
          {/* Disconnect Button */}
          <MenuDivider />
          <MenuItem
               onClick={async () => {
               console.log("Disconnecting");
                await disconnect();
                if (typeof window !== 'undefined') {
                  }
              }}
                icon={<AiOutlineDisconnect size={18} />}
            tw="bg-black text-white hocus:bg-gray-800"
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

