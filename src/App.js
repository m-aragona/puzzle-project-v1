import { useState } from 'react';
import './App.css';
import Picture from './components/Picture';
import NavBar from './components/NavBar';
import Mint from './components/Mint';
import Rules from './components/Rules';
import { ethers } from 'ethers';
import ContractManagerJSON from './ContractsDatabase.json';
import PartsCollectionJSON from './PartsCollection.json';
import { Text, Flex } from '@chakra-ui/react';

// https://m-aragona.github.io/nft-parts-project/
// npm run build
// npm run deploy

function App() {
  const [accounts, setAccounts] = useState([]);
  const [tokenId, setTokenId] = useState();
  const [chainId, setchainId] = useState();
  const [contractAddress, setContractAddress] = useState();
  const isConnected = Boolean(accounts[0]);

  async function checkPieces() {
    // Get Current Picture Contract Address
    let provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.RINKEBY_RPC_URL)
    const contractManager = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESSES,
      ContractManagerJSON.abi,
      provider
    );
    // console.log(contractManager)
    const resCurrentContract = await contractManager.currentContract()
    setContractAddress(resCurrentContract.toString())

    try {
      const contract = new ethers.Contract(
        contractAddress,
        PartsCollectionJSON.abi,
        provider
      );
      const response = await contract.tokenId();
      setTokenId(response.toNumber() - 1)
      // console.log("contract tokenId", tokenId)
    } catch (err) {
      // console.log("error: ", err)
    }

    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", async () => {
      const network = await provider.getNetwork();
      setchainId(network.chainId);

    })

    window.ethereum.on('accountsChanged', function (accounts) {
      setAccounts(accounts)
    })

  }

  checkPieces()

  return (

    <div className="App">
      <NavBar className="NavBar" position='sticky' top='0' accounts={accounts} setAccounts={setAccounts} />

      <Flex justify="space-between" height='70px'>
        <Flex width="60%" paddingLeft='50px' >
          <Text position='relative' top='-50px' fontSize="60px" fontWeight='bold'>Mint Art</Text>
        </Flex>
        <Flex justify='right' width="30%">
          <div >
            {isConnected ? (
              <Text paddingRight='15px' float='right' position='relative'
                top='-15px' textAlign='right' fontSize="17px" color="#64AB40">Your wallet: {accounts[0]}</Text>
            ) : (<Text paddingRight='15px' float='right' position='relative'
              top='-15px' textAlign='right' fontSize="17px" color="#D6517D">You must be connected to Mint!</Text>)}

            <Text paddingRight='15px' float='right' position='relative'
              top='-38px' textAlign='right' fontSize="17px" color="#D6517D">{chainId === 4 ? null : "Please Connect to Rinkeby Network to use this page."}</Text>
          </div>
        </Flex>
      </Flex>

      <Flex justify="space-between" >
        <Flex width="45%" paddingLeft='50px'>
          <div>

            {tokenId > 25 ?
              <Text fontWeight='bold' fontSize="25px">Congratulations! You have completed the image. Pieces owners will receive Full Art</Text>
              :
              <Text fontWeight='bold' fontSize="25px">There are still {tokenId === undefined ? "-" : (25 - tokenId)} NFT parts to mint!</Text>
            }

            {isConnected ?
              <Mint tokenId={tokenId} chainId={chainId} accounts={accounts} setTokenId={setTokenId} contractAddress={contractAddress} setContractAddress={setContractAddress} />
              : null}
            <Rules />
          </div>
        </Flex>
        <Flex width="40%" textAlign='center'>
          <div>
            <Text fontWeight='bold' fontSize="17px">Contract Address: {contractAddress}</Text>
            <Picture tokenId={tokenId} chainId={chainId} />
          </div>
        </Flex>
      </Flex>
    </div >

  );
}

export default App;
