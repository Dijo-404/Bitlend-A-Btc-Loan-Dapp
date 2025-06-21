import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserWallet } from '@/hooks/use-wallet';
import { BitcoinIcon } from '@/components/ui/bitcoin-icon';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting } = useUserWallet();
  const [, setLocation] = useLocation();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskInstalled(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined');
  }, []);

  const handleConnect = async (providerType: string) => {
    try {
      await connect();
      onClose();
      // Redirect to dashboard after successful connection
      setLocation('/dashboard');
    } catch (error) {
      console.error(`Error connecting to ${providerType}:`, error);
    }
  };

  const handleMetaMaskClick = () => {
    if (isMetaMaskInstalled) {
      handleConnect('MetaMask');
    } else {
      // Open MetaMask download page
      window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer');
    }
  };

  const walletOptions = [
    {
      id: 'metamask',
      name: isMetaMaskInstalled ? 'MetaMask' : 'Install MetaMask',
      description: isMetaMaskInstalled ? 'Connect using MetaMask wallet' : 'Download and install MetaMask',
      icon: <BitcoinIcon className="text-primary text-3xl" />,
      available: true,
      onClick: handleMetaMaskClick,
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'bitcoin-core',
      name: 'Bitcoin Core',
      description: 'Connect using Bitcoin Core wallet',
      icon: <i className="ri-wallet-3-line text-primary text-3xl"></i>,
      available: false,
      onClick: () => {},
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'hardware',
      name: 'Hardware Wallet',
      description: 'Connect using Ledger or Trezor',
      icon: <i className="ri-safe-2-line text-primary text-3xl"></i>,
      available: false,
      onClick: () => {},
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-r from-primary to-accent p-4 rounded-full">
                <BitcoinIcon className="text-white text-4xl" />
              </div>
            </div>
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-gradient">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Choose your preferred wallet to securely access BitLend
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 my-6">
          <AnimatePresence>
            {walletOptions.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onHoverStart={() => setHoveredWallet(wallet.id)}
                onHoverEnd={() => setHoveredWallet(null)}
              >
                <Button 
                  variant="outline" 
                  className={`
                    w-full justify-between p-6 text-base font-normal h-auto relative overflow-hidden
                    transition-all duration-300 group
                    ${wallet.available ? 'hover:border-primary/50 hover:shadow-lg' : 'opacity-60 cursor-not-allowed'}
                    ${hoveredWallet === wallet.id ? 'scale-105 shadow-medium' : ''}
                  `}
                  onClick={wallet.onClick}
                  disabled={isConnecting || !wallet.available}
                >
                  {/* Background gradient on hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${wallet.gradient} opacity-0 
                    transition-opacity duration-300 group-hover:opacity-5
                  `}></div>
                  
                  <div className="flex items-center relative z-10">
                    <motion.div
                      animate={{ 
                        rotate: hoveredWallet === wallet.id ? 360 : 0,
                        scale: hoveredWallet === wallet.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="mr-4"
                    >
                      {wallet.icon}
                    </motion.div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{wallet.name}</div>
                      <div className="text-sm text-muted-foreground">{wallet.description}</div>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ x: hoveredWallet === wallet.id ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    {wallet.available ? (
                      <i className="ri-arrow-right-line text-xl"></i>
                    ) : (
                      <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <i className="ri-shield-check-line text-success"></i>
            <span>Secured by blockchain technology</span>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">New to crypto wallets?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 text-sm hover:underline"
              >
                Download MetaMask
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a 
                href="https://ethereum.org/en/wallets/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 text-sm hover:underline"
              >
                Learn about wallets
              </a>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}