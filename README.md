# HyperSound Miner

## Overview
This repository provides a minimal setup to begin mining $HYPERS tokens.

## Prerequisites
Choose one of these options:

### Option 1: Local Installation
Before you start, ensure you have the following installed on your system: 
- ```Node.js``` and ```npm``` or ```yarn``` ([guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

### Option 2: Docker Installation
- Docker and Docker Compose ([guide](https://docs.docker.com/compose/install/))

## Get started

1. Download or clone this repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Configure your environment variables in `.env`:
   - `PRIVATE_KEY`: Your wallet's private key (use a separate wallet for mining)
   - `CALLS_PER_MINE_TX`: Number of calls per mining transaction
   - `MINE_TX_PER_MINUTE`: Mining transactions per minute
   - `RPC`: RPC endpoint
   - `GAS_LIMIT`: Gas limit for transactions

For security reasons, it's recommended to create a new wallet address specifically for mining, because the private key will be stored on your computer all the time, unencrypted. Only transfer the funds you wish to use for mining to this address.

### Running with Node.js
1. Run ```npm i``` or ```yarn``` to install the dependencies
2. Run ```node mine.js``` to launch the miner bot

### Running with Docker
1. Start the miner:
   ```bash
   docker compose up
   ```
2. Stop the miner:
   ```bash
   docker compose down # or just exit with CTRL+C
   ```

Please note: This example is very basic and will need to be improved to remain competitive over a long period of time.

## License

This project is licensed under the MIT License.

## Author

@blastoshi_