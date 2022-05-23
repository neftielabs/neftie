import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";

const {
  ETHERSCAN_API_KEY,
  ALCHEMY_URL,
  ADMIN_PRIVATE_KEY,
  SELLER_PRIVATE_KEY,
  COINMARKETCAP_KEY,
  CI,
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: CI
    ? {}
    : {
        enabled: true,
        currency: "USD",
        gasPrice: 30,
        coinmarketcap: COINMARKETCAP_KEY,
      },
  networks: CI
    ? {}
    : {
        goerli: {
          url: ALCHEMY_URL,
          accounts: [
            `0x${String(ADMIN_PRIVATE_KEY)}`,
            `0x${String(SELLER_PRIVATE_KEY)}`,
          ],
        },
      },
  etherscan: CI
    ? {}
    : {
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
