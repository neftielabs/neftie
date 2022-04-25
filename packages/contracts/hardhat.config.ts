import "dotenv/config";
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";

const { ETHERSCAN_API_KEY, ALCHEMY_URL, PRIVATE_KEY, COINMARKETCAP_KEY } =
  process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "rinkeby",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 30,
    coinmarketcap: COINMARKETCAP_KEY,
  },
  networks: {
    rinkeby: {
      url: ALCHEMY_URL,
      accounts: [`0x${String(PRIVATE_KEY)}`],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  paths: {
    sources: "src",
  },
};

export default config;
