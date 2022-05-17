import { Link, Text, Flex, Input, Button } from '@chakra-ui/react';
import PartsCollectionJSON from '../PartsCollection.json';
import { ethers } from 'ethers';


const Rules = () => {

    async function handleClaimFullArt() {
        let inputAddress = document.getElementById("input_address").value
        // console.log("input Address:", inputAddress)

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                inputAddress,
                PartsCollectionJSON.abi,
                signer
            );
            try {
                const response = await contract.claimFullArt();
                // setIsClaiming(true)
                await response.wait();
                // setIsClaiming(false)
            } catch (err) {
                console.log("error: ", err)
            }
        } else {
            console.log("window.ethereum = false")
        }
    }

    return (
        <>
            <div style={{ background: "#ECECEC", padding: '5px', height: '505px', borderRadius: '10px' }}>
                <div style={{ paddingLeft: '25px', paddingRight: '20px' }}>
                    <Text fontWeight='bold' fontSize="25px" textStyle='bold' >How to do it:</Text>
                    <Text fontSize="20px">1. Connect your <b>Metamask</b> to this <b>webpage</b>.</Text>
                    <Text fontSize="20px">2. In your <b>Metamask</b>, connect to <b>Rinkeby Network</b>.</Text>
                    <Text fontSize="20px">3. Get some <b>fake ETH</b> from here: <Link href="https://rinkebyfaucet.com" isExternal="true">https://rinkebyfaucet.com</Link></Text>
                    <Text fontSize="20px">4. Select how many parts you want to mint and click on <b>Mint Now!</b></Text>
                    <Text fontSize="20px">5. When fully minted, if you have at least one part of this piece of art you will receive the <b>Full Art NFT</b>.</Text>
                    <Text fontSize="20px">6. Remember you can sell or buy your parts or other parts in <b><Link href="https://testnets.opensea.io" isExternal="true">Opensea</Link></b>.</Text>
                    <Text fontSize="20px">7. If you own all 25 parts of the piece, you can <b>claim the Full Art NFT</b> by <b>burning all 25 pieces</b>. You can proceed by putting the <b>contract address</b> and press the <b>"Claim" button</b> below.</Text>
                </div>

                <Flex justify="left" align="center" width='full' paddingLeft='25px'>
                    <Input id="input_address"
                        fontFamily="inherit" textAlign="left"
                        type="text" fontSize="17px" width='500px' placeholder='Contract Address...'>
                    </Input>
                    <Button background="black"
                        borderRadius="5px"
                        boxShadow="0px 2px 2px 1px #0F0F0F"
                        color="white"
                        cursor="pointer"
                        fontFamily="inherit"
                        padding='3px'
                        fontSize="17px"
                        marginLeft='10px'
                        onClick={handleClaimFullArt}>Claim</Button>
                </Flex>
            </div>
        </>
    )

}

export default Rules;