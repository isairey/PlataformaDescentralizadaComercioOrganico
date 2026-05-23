![Stella_ecommerce_dapp_banner](https://github.com/user-attachments/assets/c0c30c98-9f58-4de7-9916-1d2f63a634a0)

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Video Demo](#video-demo)
- [License](#license)

## Overview

Dvilla Local Food Store project is a decentralised E-Commerce app where users can register an account and purchase organic foods and fruits, the app also rewards consistent users a little percentage to encourage people to stay on healthy foods and promote good living

## Video DEMO

[![smart_contract_explained](https://img.youtube.com/vi/tsdbotowpKA/0.jpg)](https://youtu.be/tsdbotowpKA)

## Installation

Provide step-by-step instructions on how to install the project. For example:

```bash
git clone https://github.com/ChielokaCode/stellar_ecommerce_project.git
cd stella_ecommerce_project
npm install
npm run dev
```

If you make changes to the contract functions, deploy the contract by following this commands

```bash
stellar contract install \
--network testnet \
--source token-admin \
--wasm target/wasm32-unknown-unknown/release/stellar_localfoodstore_contract.wasm
```

Replace the WASM Hash generated above into the (--wasm-hash) below

```bash
stellar contract deploy \
--wasm-hash f02ce4b958e5e5d426e40787486d6c46fdc4826c874b93e307dac74f1191f1db \
--source token-admin \
--network testnet
```

Then copy and paste the deployed contract address into the "deployments.json" file located in the contracts folder

```bash
[
{
    "contractId": "localfoodstore",
    "networkPassphrase": "Test SDF Network ; September 2015",
    "contractAddress": "CAIX6652FLBZZRDQW3T5AUPKL3232PNUN33QUOROLWVWYY6G2GFHODL3"
  }
]
```

## License

[MIT Licence](https://github.com/ChielokaCode/stellar_ecommerce_project/blob/main/LICENSE) is added to Repo
