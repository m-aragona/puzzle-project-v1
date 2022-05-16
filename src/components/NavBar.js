import React from 'react';
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react';
import Facebook from "../assets/facebook_30.png";
import Twitter from "../assets/twitter_30.png";
import Instagram from "../assets/instagram_30.png";

// accounts y setAccounts son los parametros que se pasan desde el main App.js
const NavBar = ({ accounts, setAccounts }) => {
    //const [isClaiming, setIsClaiming] = useState();
    const isConnected = Boolean(accounts[0]); // Esto detecta cuando estamos o no conectados

    // Esta funcion hace update de accounts en App.js
    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccounts(accounts);
            console.log(accounts[0])
        }
    }

    return (
        <>
            <Flex justify="space-between" align="center" padding="15px" background="black" >

                {/* Left Side - Social Media Icons */}
                <Flex justify="space-around" width="20%">
                    <Link href="https://www.facebook.com" isExternal="true">
                        <Image src={Facebook} boxSize="30px" />
                    </Link>
                    <Link href="https://www.twitter.com" isExternal="true">
                        <Image src={Twitter} boxSize="30px" />
                    </Link>
                    <Link href="https://www.instagram.com" isExternal="true">
                        <Image src={Instagram} boxSize="30px" />
                    </Link>
                </Flex>


                {/* Right Side - Sections and Connect */}
                <Flex justify="space-around" align="center" width="25%" marginRight="10px">
                    <Box textColor='white' fontSize='17px' cursor="pointer" >About</Box>
                    <Spacer />
                    {/* <Box textColor='white' onClick={handleMint} margin="0 15px" cursor="pointer" fontSize='40px'>Mint</Box> */}
                    <Box textColor='white' cursor="pointer" fontSize='17px'>Team</Box>
                    <Spacer />

                    {/* style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'left' }} */}
                    {/* Connect */}
                    <div style={{}}>
                        {/* borderStyle: 'solid', borderColor: 'white' */}
                        {isConnected ? (
                            <Button background="#64AB40"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                fontFamily="inherit"
                                width="100px"
                                height="35px"
                                fontSize='17px'>Connected</Button>
                        ) : (
                            <Button
                                background="#D6517D"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                width="100px"
                                height="35px"
                                fontSize='17px'
                                onClick={connectAccount}>Connect</Button>
                        )}

                    </div>
                </Flex>

            </Flex>

        </>
    )
}

export default NavBar;