import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBTC } from '@/lib/utils';
import { MetricCard } from '@/components/shared/MetricCard';
import { LoanTable } from '@/components/shared/LoanTable';
import { TransactionItem } from '@/components/shared/TransactionItem';
import { MarketplaceLoanCard } from '@/components/shared/MarketplaceLoanCard';
import { useToast } from '@/hooks/use-toast';
import { Loan } from '@shared/schema';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Query user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/user/stats'],
  });
  
  // Query active loans
  const { data: activeLoans, isLoading: loansLoading } = useQuery({
    queryKey: ['/api/loans/active'],
  });
  
  // Query recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  // Query marketplace loans
  const { data: marketplaceLoans, isLoading: marketplaceLoading } = useQuery({
    queryKey: ['/api/loans/marketplace'],
  });

  const handleViewLoanDetails = (loan: Loan) => {
    setLocation(`/loans/${loan.id}`);
  };

  const handleAcceptLoan = (loan: Loan) => {
    toast({
      title: 'Coming Soon',
      description: 'This feature is under development',
    });
  };

  const recentTransactions = transactions?.slice(0, 3) || [];
  const highlightedMarketplaceLoans = marketplaceLoans?.slice(0, 4) || [];
  
  return (
    <motion.div 
      className="p-4 md:p-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="overflow-hidden border-none shadow-strong">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
              {/* Background decorations */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              </div>
              
              <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="text-white mb-6 md:mb-0 flex-1">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Welcome to BitLend
                  </motion.h2>
                  <motion.p 
                    className="text-white/90 max-w-md text-lg mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Your secure platform for peer-to-peer Bitcoin lending. Discover opportunities in our marketplace.
                  </motion.p>
                  <motion.div 
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Link href="/marketplace">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" variant="secondary" className="font-semibold shadow-lg">
                          <i className="ri-store-2-line mr-2"></i> Explore Marketplace
                        </Button>
                      </motion.div>
                    </Link>
                    <Link href="/wallet">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold backdrop-blur-sm"
                        >
                          <i className="ri-wallet-3-line mr-2"></i> Manage Wallet
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute inset-0 bg-white/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.div>
                    <motion.div 
                      className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <i className="ri-bit-coin-line text-white text-6xl md:text-7xl"></i>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Portfolio Overview</h2>
            <p className="text-muted-foreground">Track your lending and borrowing activity</p>
          </div>
          <motion.div 
            className="flex items-center bg-muted/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm mt-4 md:mt-0"
            whileHover={{ scale: 1.05 }}
          >
            <motion.i 
              className="ri-time-line mr-2 text-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            ></motion.i>
            <span className="font-medium">Last updated: Just now</span>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Borrowed"
            value={statsLoading ? "..." : formatBTC(stats?.totalBorrowed || 0)}
            icon="arrow-down"
            iconColor="primary"
            changeValue="12.3%"
            changeText="vs last month"
            isPositive={true}
            isBitcoin={true}
            delay={0}
          />
          
          <MetricCard
            title="Total Lent"
            value={statsLoading ? "..." : formatBTC(stats?.totalLent || 0)}
            icon="arrow-up"
            iconColor="accent"
            changeValue="8.7%"
            changeText="vs last month"
            isPositive={true}
            isBitcoin={true}
            delay={0.1}
          />
          
          <MetricCard
            title="Active Loans"
            value={statsLoading ? "..." : stats?.activeLoans || 0}
            icon="time"
            iconColor="success"
            changeValue="2"
            changeText="new this week"
            isPositive={true}
            delay={0.2}
          />
          
          <MetricCard
            title="Interest Earned"
            value={statsLoading ? "..." : formatBTC(stats?.interestEarned || 0)}
            icon="percent"
            iconColor="warning"
            changeValue="5.2%"
            changeText="vs last month"
            isPositive={true}
            isBitcoin={true}
            delay={0.3}
          />
        </div>
      </motion.div>
      
      {/* Your Active Loans */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Active Loans</h2>
            <p className="text-muted-foreground">Monitor your current lending positions</p>
          </div>
          <Link href="/loans">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="text-primary hover:bg-primary/5 font-medium">
                View All Loans <i className="ri-arrow-right-line ml-2"></i>
              </Button>
            </motion.div>
          </Link>
        </div>
        
        <Card className="border border-border/50 rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
          <AnimatePresence mode="wait">
            {loansLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <motion.div 
                  className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <p className="text-muted-foreground">Loading your active loans...</p>
              </motion.div>
            ) : activeLoans && activeLoans.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-12 text-center"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <i className="ri-inbox-line text-4xl text-muted-foreground"></i>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">No active loans</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  You don't have any active loans at the moment. Explore our marketplace to find opportunities.
                </p>
                <Link href="/marketplace">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="btn-primary">
                      <i className="ri-store-2-line mr-2"></i>
                      Browse Marketplace
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoanTable 
                  loans={activeLoans || []} 
                  onViewDetails={handleViewLoanDetails} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
      
      {/* Recent Transactions and Loan Marketplace */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full rounded-xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <motion.div 
                    className="bg-primary/15 p-2 rounded-lg mr-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <i className="ri-exchange-funds-line text-xl text-primary"></i>
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">Latest transactions</p>
                  </div>
                </div>
                <Link href="/transactions">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button variant="ghost" className="text-primary hover:bg-primary/5 text-sm">
                      View All <i className="ri-arrow-right-line ml-1"></i>
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {transactionsLoading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <motion.div 
                        className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                      <p className="text-muted-foreground text-sm">Loading transactions...</p>
                    </motion.div>
                  ) : recentTransactions.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center py-8"
                    >
                      <motion.div 
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <i className="ri-file-list-line text-2xl text-muted-foreground"></i>
                      </motion.div>
                      <h3 className="font-medium mb-2">No transactions yet</h3>
                      <p className="text-sm text-muted-foreground">Your activity will appear here</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {recentTransactions.map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <TransactionItem transaction={transaction} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Loan Marketplace */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full rounded-xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <motion.div 
                    className="bg-accent/15 p-2 rounded-lg mr-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <i className="ri-store-2-line text-xl text-accent"></i>
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold">Marketplace Highlights</h2>
                    <p className="text-sm text-muted-foreground">Featured lending opportunities</p>
                  </div>
                </div>
                <Link href="/marketplace">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button variant="outline" className="text-accent border-accent/30 hover:bg-accent/5">
                      Browse All <i className="ri-arrow-right-line ml-1"></i>
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <AnimatePresence mode="wait">
                {marketplaceLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <motion.div 
                      className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <p className="text-muted-foreground">Loading opportunities...</p>
                  </motion.div>
                ) : highlightedMarketplaceLoans.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16"
                  >
                    <motion.div 
                      className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <i className="ri-store-2-line text-5xl text-muted-foreground"></i>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">No opportunities available</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Check back later for new lending opportunities or visit our full marketplace.
                    </p>
                    <Link href="/marketplace">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="btn-accent">
                          <i className="ri-store-2-line mr-2"></i>
                          Visit Marketplace
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                  >
                    {highlightedMarketplaceLoans.map((loan, index) => (
                      <motion.div 
                        key={loan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="card-hover"
                      >
                        <MarketplaceLoanCard 
                          loan={loan}
                          rating={4.5}
                          onAccept={handleAcceptLoan}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}