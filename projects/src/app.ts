import { Wallet } from '../types';
import { isMetaMaskInstalled } from '../utils';
import { ethers } from 'ethers';
// 增强 Window 对象的类型定义
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (arg: any) => void) => void;
    };
  }
}


const connectMetaMask = async (): Promise<any> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Request account access
    const accounts = await window.ethereum?.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }


    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const { chainId } = await provider.getNetwork();

    // Set up event listeners for account and chain changes
    window.ethereum?.on('accountsChanged', (newAccounts: string[]) => {
      if (newAccounts.length === 0) {
        // User disconnected their wallet
        window.dispatchEvent(new CustomEvent('wallet_disconnected'));
      } else {
        // User changed their account
        window.dispatchEvent(
          new CustomEvent('wallet_accountsChanged', {
            detail: { accounts: newAccounts },
          })
        );
      }
    });

    window.ethereum?.on('chainChanged', (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      window.dispatchEvent(
        new CustomEvent('wallet_chainChanged', {
          detail: { chainId: newChainId },
        })
      );
    });

    return {
      provider,
      signer,
      address,
      chainId,
    };
  } catch (error) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
};

export const metaMaskWallet: Wallet = {
  id: 'metamask',
  name: 'MetaMask',
  icon: () => null, // This will be replaced with the actual icon component
  connector: connectMetaMask,
  installed: isMetaMaskInstalled(),
  downloadUrl: 'https://metamask.io/download/',
  description: 'Connect to your MetaMask Wallet',
};

export default metaMaskWallet;