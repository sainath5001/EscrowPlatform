require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Use Alchemy/Infura RPC
      accounts: [process.env.PRIVATE_KEY], // Use your private key (from MetaMask)
    },
  },
};

