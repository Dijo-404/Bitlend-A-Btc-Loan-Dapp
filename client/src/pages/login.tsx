import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BitcoinIcon } from '@/components/ui/bitcoin-icon';
import { useAuth } from '@/hooks/use-auth';
import { WalletModal } from '@/components/shared/WalletModal';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [, setLocation] = useLocation();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      // Redirect to dashboard after successful login
      setLocation('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div 
            className="flex items-center justify-center mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50"></div>
              <BitcoinIcon className="text-primary text-5xl relative z-10" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold ml-3 text-gradient"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              BitLend
            </motion.h1>
          </motion.div>
          <motion.p 
            className="text-muted-foreground text-lg"
            variants={itemVariants}
          >
            Decentralized Bitcoin Lending Platform
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass shadow-strong border-border/20">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to access your lending dashboard
                </CardDescription>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <TabsList className="grid grid-cols-2 mt-6 bg-muted/50">
                    <TabsTrigger 
                      value="email" 
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <i className="ri-mail-line mr-2"></i>
                      Email
                    </TabsTrigger>
                    <TabsTrigger 
                      value="wallet"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <i className="ri-wallet-3-line mr-2"></i>
                      Wallet
                    </TabsTrigger>
                  </TabsList>
                </motion.div>
              </CardHeader>
              
              <AnimatePresence mode="wait">
                <TabsContent value="email" key="email">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="space-y-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <i className="ri-mail-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                                    <Input 
                                      placeholder="your@email.com" 
                                      className="pl-10 input-enhanced focus-enhanced"
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <i className="ri-lock-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                                    <Input 
                                      type="password" 
                                      placeholder="••••••••" 
                                      className="pl-10 input-enhanced focus-enhanced"
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="submit" 
                              className="w-full btn-primary h-12 text-base font-medium"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <i className="ri-loader-4-line"></i>
                                </motion.div>
                              ) : (
                                <i className="ri-login-box-line mr-2"></i>
                              )}
                              {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                          </motion.div>
                        </form>
                      </Form>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col space-y-4 pt-2">
                      <motion.div 
                        className="text-center w-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                          Forgot your password?
                        </a>
                      </motion.div>
                      <div className="text-center w-full">
                        <p className="text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <motion.a 
                            href="#" 
                            className="text-primary hover:text-primary/80 transition-colors font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            Sign up
                          </motion.a>
                        </p>
                      </div>
                    </CardFooter>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="wallet" key="wallet">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="text-center py-8">
                      <motion.div 
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-8 mb-6"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <BitcoinIcon className="text-primary text-5xl" />
                        </motion.div>
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-gradient">Connect with Your Wallet</h3>
                      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Use your cryptocurrency wallet to sign in securely without passwords.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          className="w-full btn-primary h-12 text-base font-medium"
                          onClick={handleConnectWallet}
                        >
                          <i className="ri-wallet-3-line mr-2 text-lg"></i>
                          Connect Wallet
                        </Button>
                      </motion.div>
                    </CardContent>
                    
                    <CardFooter className="text-center pt-2">
                      <p className="text-sm text-muted-foreground w-full">
                        By connecting your wallet, you agree to our{" "}
                        <motion.a 
                          href="#" 
                          className="text-primary hover:text-primary/80 transition-colors font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          Terms of Service
                        </motion.a>
                      </p>
                    </CardFooter>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </Card>
        </motion.div>

        {/* Security badges */}
        <motion.div 
          className="flex justify-center items-center space-x-6 mt-8 text-sm text-muted-foreground"
          variants={itemVariants}
        >
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <i className="ri-shield-check-line text-success"></i>
            <span>Secure</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <i className="ri-lock-line text-primary"></i>
            <span>Encrypted</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <i className="ri-global-line text-accent"></i>
            <span>Decentralized</span>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}