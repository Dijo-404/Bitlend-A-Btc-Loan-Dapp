import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BitcoinIcon } from '@/components/ui/bitcoin-icon';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  changeValue?: string | number;
  changeText?: string;
  isPositive?: boolean;
  isBitcoin?: boolean;
  gradient?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon,
  iconColor,
  changeValue,
  changeText,
  isPositive = true,
  isBitcoin = false,
  gradient,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="metric-card h-full group">
        <CardContent className="p-6 h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
              <div className="flex items-center mb-3">
                {isBitcoin && (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <BitcoinIcon className="text-primary" size={24} />
                  </motion.div>
                )}
                <motion.p 
                  className="text-3xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.3 }}
                >
                  {value}
                </motion.p>
              </div>
              
              {(changeValue || changeText) && (
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.4, duration: 0.3 }}
                >
                  <div className={cn(
                    "flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    isPositive 
                      ? "bg-success/15 text-success border border-success/20" 
                      : "bg-destructive/15 text-destructive border border-destructive/20"
                  )}>
                    <motion.i 
                      className={`ri-arrow-${isPositive ? 'up' : 'down'}-line mr-1`}
                      animate={{ y: isPositive ? [-2, 0, -2] : [2, 0, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {changeValue}
                  </div>
                  {changeText && (
                    <span className="text-xs text-muted-foreground">{changeText}</span>
                  )}
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className={cn(
                "rounded-xl p-3 shadow-soft",
                iconColor === 'primary' && "bg-gradient-to-br from-primary/15 to-primary/5 text-primary",
                iconColor === 'accent' && "bg-gradient-to-br from-accent/15 to-accent/5 text-accent",
                iconColor === 'success' && "bg-gradient-to-br from-success/15 to-success/5 text-success",
                iconColor === 'warning' && "bg-gradient-to-br from-warning/15 to-warning/5 text-warning"
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <i className={`ri-${icon}-line text-2xl`}></i>
            </motion.div>
          </div>
          
          {/* Gradient overlay */}
          {gradient && (
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg",
              gradient
            )}></div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}