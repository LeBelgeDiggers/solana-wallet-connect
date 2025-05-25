# Solana-Wallet-Connect

A lightweight JavaScript class for managing Solana wallet connections in web applications. Supports popular wallets including Phantom, Solflare, and Backpack.

## Features

- 🔗 **Multi-wallet support**: Phantom, Solflare, Backpack
- 🔄 **Automatic detection**: Detects available wallets in the browser
- 🛡️ **Error handling**: Built-in retry logic and error management
- 📱 **Simple API**: Easy-to-use methods for connection management
- ⚡ **Lightweight**: No external dependencies

## Installation

Simply copy the `wallet.js` file to your project:

```javascript
import Wallet from './utils/wallet.js'
```

## Quick Start

```javascript
// Initialize wallet
const wallet = new Wallet()

// Connect to wallet
try {
  const result = await wallet.connect()
  console.log('Connected:', result.publicKey.toString())
} catch (error) {
  console.error('Connection failed:', error.message)
}

// Check connection status
if (wallet.connected) {
  console.log('Wallet is connected')
  console.log('Public key:', wallet._publicKey.toString())
}

// Disconnect wallet
await wallet.disconnect()
```

## API Reference

### Constructor

```javascript
const wallet = new Wallet()
```

Automatically detects available wallets. Throws an error if no wallet is found.

### Methods

#### `connect()`
Initiates wallet connection with retry logic.

```javascript
const result = await wallet.connect()
// Returns: { publicKey: PublicKey }
```

#### `disconnect()`
Disconnects the wallet and resets internal state.

```javascript
await wallet.disconnect()
```

#### `isReady()`
Checks if the wallet is ready for connection.

```javascript
const ready = wallet.isReady()
// Returns: boolean
```

#### `getWalletInfo()`
Returns information about the detected wallet.

```javascript
const info = wallet.getWalletInfo()
// Returns: {
//   isPhantom: boolean,
//   isSolflare: boolean,
//   isBackpack: boolean,
//   hasConnect: boolean,
//   publicKey: string | null,
//   connected: boolean
// }
```

#### `signTransaction(transaction)`
Signs a Solana transaction.

```javascript
const signedTx = await wallet.signTransaction(transaction)
```

#### `signMessage(message)`
Signs a message.

```javascript
const signature = await wallet.signMessage(message)
```

### Properties

- `connected`: Boolean indicating connection status
- `_publicKey`: The wallet's public key (when connected)
- `_wallet`: Reference to the detected wallet provider

## Supported Wallets

| Wallet | Detection Method | Notes |
|--------|------------------|-------|
| Phantom | `window.solana.isPhantom` | Most popular Solana wallet |
| Solflare | `window.solflare.isSolflare` | Web and mobile support |
| Backpack | `window.backpack.isBackpack` | Multi-chain wallet |

## Error Handling

The class includes built-in error handling and retry logic:

- **Retry mechanism**: Up to 3 connection attempts with 1-second delays
- **Graceful failures**: Proper error messages for debugging
- **State management**: Automatic cleanup on connection failures

```javascript
try {
  await wallet.connect()
} catch (error) {
  if (error.message.includes('No wallet detected')) {
    // Handle no wallet case
  } else if (error.message.includes('Failed to connect after')) {
    // Handle connection timeout
  }
}
```

## Usage Examples

### Basic Integration

```javascript
class WalletManager {
  constructor() {
    this.wallet = null
  }

  async init() {
    try {
      this.wallet = new Wallet()
      console.log('Wallet detected:', this.wallet.getWalletInfo())
    } catch (error) {
      console.error('No wallet available:', error.message)
    }
  }

  async connect() {
    if (!this.wallet) return false
    
    try {
      const result = await this.wallet.connect()
      return result.publicKey.toString()
    } catch (error) {
      console.error('Connection failed:', error.message)
      return false
    }
  }
}
```

### Vue.js Composable

```javascript
// composables/useWallet.js
import Wallet from '~/utils/wallet.js'

export const useWallet = () => {
  const connected = ref(false)
  const publicKey = ref(null)
  const error = ref(null)
  
  let walletInstance = null

  const connectWallet = async () => {
    try {
      if (!walletInstance) {
        walletInstance = new Wallet()
      }
      
      const result = await walletInstance.connect()
      connected.value = true
      publicKey.value = result.publicKey.toString()
      error.value = null
    } catch (err) {
      error.value = err.message
      connected.value = false
    }
  }

  return {
    connected,
    publicKey,
    error,
    connectWallet
  }
}
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires wallet browser extensions to be installed
- Works with both desktop and mobile wallet apps

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use in your projects.
