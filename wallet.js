/**
 * Wallet class to manage crypto wallet connections (Solana)
 * Supports wallets: Backpack, Solflare, Phantom, Solana
 */
export default class Wallet {
  provider  
  _wallet  

  connected = false  
  _publicKey = null  

  constructor() { 
    this.detectWallet()

    if (!this._wallet) {
      throw new Error("No wallet detected")
    }
    
    console.log("Wallet detected, ready to connect")
  }

  /**
   * Method to initiate manual connection
   * With error handling and retry logic
   */
  async connect() {
    console.log("Connecting to wallet...")
    
    try {
      // Check if the wallet is still available
      if (!this._wallet || !this._wallet.connect) {
        throw new Error("Wallet not available or connect method missing")
      }

      // Try to connect with retry logic
      const result = await this.connectWithRetry()
      this.onConnect(result)
      return result
    } catch (error) {
      console.error("Connection failed:", error)
      throw error
    }
  }

  /**
   * Method to connect with retry logic to handle Phantom issues
   */
  async connectWithRetry(maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Connection attempt ${attempt}/${maxRetries}`)
        
        // For Phantom, we can try different approaches
        if (this._wallet.isPhantom) {
          // Method 1: Standard connection
          const result = await this._wallet.connect()
          console.log("Connection successful on attempt", attempt)
          return result
        } else {
          // For other wallets
          const result = await this._wallet.connect()
          return result
        }
      } catch (error) {
        console.warn(`Connection attempt ${attempt} failed:`, error.message)
        
        if (attempt === maxRetries) {
          // If it's the last attempt, throw an error
          throw new Error(`Failed to connect after ${maxRetries} attempts: ${error.message}`)
        }
        
        // Wait before the next attempt
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  onConnect(r) { 
    console.log("onConnect", r.publicKey.toString())
    this.connected = true
    this._publicKey = r.publicKey
  }

  signTransaction(txn) { 
    return this._wallet.signTransaction(txn)
  }

  signMessage(msg) { 
    return this._wallet.signMessage(msg)
  }

  detectWallet() { 
    // For Phantom, the object is available directly on window.solana
    if (window.solana && window.solana.isPhantom) {
      console.log("Detected phantom")
      this._wallet = window.solana
      return
    }

    // For Solflare
    if (window.solflare && window.solflare.isSolflare) {
      console.log("Detected solflare")
      this._wallet = window.solflare
      return
    }

    // For Backpack
    if (window.backpack && window.backpack.isBackpack) {
      console.log("Detected backpack")
      this._wallet = window.backpack
      return
    }

    // Fallback for other wallets
    const _availableWallets = ["solana", "phantom", "solflare", "backpack"]
    for (let i = 0; i < _availableWallets.length; i++) {
      if (window[_availableWallets[i]]) {
        console.log("Detected", _availableWallets[i])
        this._wallet = window[_availableWallets[i]]
        break
      }
    }
  }

  /**
   * Method to check if the wallet is ready
   */
  isReady() {
    return this._wallet && typeof this._wallet.connect === 'function'
  }

  /**
   * Method to disconnect the wallet
   */
  async disconnect() {
    console.log("Disconnecting wallet instance...")
    
    try {
      // Try to disconnect using the wallet's disconnect method if available
      if (this._wallet && typeof this._wallet.disconnect === 'function') {
        await this._wallet.disconnect()
      }
    } catch (error) {
      console.warn("Error during wallet disconnect:", error)
    } finally {
      // Reset internal state
      this.connected = false
      this._publicKey = null
      console.log("Wallet instance disconnected")
    }
  }

  /**
   * Method to get information about the detected wallet
   */
  getWalletInfo() {
    if (!this._wallet) return null
    
    return {
      isPhantom: !!this._wallet.isPhantom,
      isSolflare: !!this._wallet.isSolflare,
      isBackpack: !!this._wallet.isBackpack,
      hasConnect: typeof this._wallet.connect === 'function',
      publicKey: this._publicKey?.toString() || null,
      connected: this.connected
    }
  }
} 
