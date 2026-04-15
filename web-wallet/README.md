# Web Wallet

A non-custodial, browser-based crypto wallet built with **React**, **TypeScript**, and **Vite**. Generate or import a BIP-39 seed phrase and instantly derive Ethereum and Solana accounts — all keys are computed client-side and never leave your device.

## Demo

https://github.com/user-attachments/assets/1fcc4b1d-f3dd-4206-ba24-9b7dfb9ea4d0

## Features

- **Generate wallet** — creates a cryptographically secure 12-word BIP-39 mnemonic
- **Import wallet** — restore an existing wallet from any valid seed phrase
- **Multi-chain accounts** — derives Ethereum (`m/44'/60'`) and Solana (`m/44'/501'`) keypairs from a single seed
- **Multiple accounts** — add as many accounts as you need, each with its own keypair
- **Balance lookup** — fetch live on-chain balance for any account via the backend RPC proxy
- **Private key protection** — secret keys are blurred by default; click to reveal
- **Dark UI** — clean, minimal dark-themed interface

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React 19, TypeScript, Vite, react-router-dom |
| Crypto | bip39, ed25519-hd-key, @solana/web3.js, ethers.js |
| Backend | Node.js, Express, Axios |
| RPC | Alchemy (Ethereum + Solana mainnet) |

## Getting Started

### Frontend

```bash
cd web-wallet
npm install
npm run dev
```

### Backend

```bash
cd backend-web-wallet
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## How It Works

1. **Dashboard** — choose to generate a new wallet or import an existing one via seed phrase
2. **Mnemonic page** — your seed phrase is shown (hidden by default, click to reveal); a warning reminds you to keep it safe
3. **Accounts** — click **+ Add Account** to derive a new Ethereum + Solana keypair; click **Get Balance** on any account to fetch its current on-chain balance

## Security Notes

- Keys are derived entirely in the browser — the backend only proxies RPC calls and never sees your seed or private keys
- Never share your seed phrase with anyone
- This project is for educational purposes; use a hardware wallet for significant funds
