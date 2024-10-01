require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");

const etherscanKey = fs.readFileSync(".etherscan").toString().trim();
const sepoliaKey = fs.readFileSync(".sepolia").toString().trim();
const key = fs.readFileSync(".key").toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + sepoliaKey,
      accounts: [key]
    },
    holesky: {
      url: "https://holesky.infura.io/v3/" + sepoliaKey,
      accounts: [key]
    }
  },
  etherscan:{
    apiKey: etherscanKey,
  }
};
