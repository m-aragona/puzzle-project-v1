import { useState } from 'react';
import { ethers, BigNumber, Wallet } from 'ethers';
import PartsCollectionJSON from '../PartsCollection.json';
import { Button, Flex, Input } from '@chakra-ui/react';
import ContractManagerJSON from '../ContractsDatabase.json';


const Mint = ({ tokenId, setTokenId, contractAddress, setContractAddress }) => {
    const [isMinting, setIsMinting] = useState();
    const [mintAmount, setMintAmount] = useState(1);

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // console.log("contract:", contractAddress)
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                PartsCollectionJSON.abi,
                signer
            );
            try {
                const response = await contract.mint(BigNumber.from(mintAmount), { value: 100000000000000 * mintAmount }); // Solidity requiere que se lo pase como BigNumber
                setIsMinting(true)
                await response.wait();
                setIsMinting(false)
                setMintAmount(1)

                // Listen Event

                const response2 = await contract.tokenId();
                setTokenId(response2.toNumber() - 1)
                if (response2.toNumber() - 1 >= 25) {
                    console.log("New Contract")

                    let provider2 = new ethers.providers.AlchemyProvider("rinkeby", process.env.RINKEBY_RPC_URL);
                    const signer2 = new Wallet(process.env.REACT_APP_PRIVATE_KEY, provider2)
                    const contract2 = new ethers.Contract(
                        process.env.REACT_APP_CONTRACT_ADDRESSES,
                        ContractManagerJSON.abi,
                        signer2
                    );
                    try {
                        let tx = await contract2.setContractsPop();
                        await tx.wait();
                        const newContract = await contract2.currentContract()
                        const newContractAddress = newContract.toString()

                        setContractAddress(newContractAddress)

                    } catch (err) {
                        console.log(err)
                    }
                }

            } catch (err) {
                console.log("error: ", err)
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount === 1) return;
        setMintAmount(mintAmount - 1);
    }

    const handleIncrement = () => {
        if (mintAmount >= 25 - tokenId) return;
        setMintAmount(mintAmount + 1);
    }

    return (
        <>
            <Flex justify="left" align="center" marginBottom='10px'>
                <Button background="black"
                    color="white"
                    cursor="pointer"
                    fontFamily="inherit"
                    fontSize="17px"
                    width="30px"
                    height="30px"
                    onClick={handleDecrement}>-</Button>
                <Input readOnly
                    fontFamily="inherit" width="100px" height="23px" textAlign="center"
                    paddingLeft="19px" type="number" value={mintAmount}
                    fontSize="20px" >
                </Input>
                <Button background="black"
                    color="white"
                    cursor="pointer"
                    fontFamily="inherit"

                    fontSize="17px"
                    width="30px"
                    height="30px"
                    onClick={handleIncrement}>+
                </Button>
                <Button background="black"
                    borderRadius="5px"
                    color="white"
                    cursor="pointer"
                    fontFamily="inherit"
                    fontSize="17px"
                    height="32px"
                    marginLeft='15px'
                    onClick={handleMint}>{isMinting ? "Minting..." : "Mint Now"}</Button>
            </Flex>
        </>
    )
}

export default Mint;