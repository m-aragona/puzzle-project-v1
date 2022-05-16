require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

require('dotenv').config()
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_TOKEN = process.env.ETHERSCAN_TOKEN

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY]
    },
  },
  solidity: "0.8.4",
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_TOKEN
  }
};
