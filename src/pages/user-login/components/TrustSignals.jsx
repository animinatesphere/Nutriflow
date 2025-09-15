import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: 'Lock',
      title: 'Privacy First',
      description: 'We never share your personal information'
    },
    {
      icon: 'Award',
      title: 'Trusted by 50K+',
      description: 'Join thousands of satisfied users'
    }
  ];

  const securityBadges = [
    {
      name: 'SSL Certificate',
      icon: 'ShieldCheck',
      color: 'var(--color-success)'
    },
    {
      name: 'GDPR Compliant',
      icon: 'FileCheck',
      color: 'var(--color-primary)'
    },
    {
      name: 'SOC 2 Type II',
      icon: 'Verified',
      color: 'var(--color-secondary)'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      {/* Trust Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {trustFeatures?.map((feature, index) => (
          <motion.div
            key={feature?.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="text-center p-6 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
              <Icon name={feature?.icon} size={24} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              {feature?.title}
            </h3>
            <p className="text-sm text-muted-foreground font-body">
              {feature?.description}
            </p>
          </motion.div>
        ))}
      </div>
      {/* Security Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-4 py-6 border-t border-border/50"
      >
        <span className="text-sm text-muted-foreground font-body mr-4">
          Secured by:
        </span>
        {securityBadges?.map((badge, index) => (
          <motion.div
            key={badge?.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-full border border-border/50"
          >
            <Icon name={badge?.icon} size={16} color={badge?.color} />
            <span className="text-xs font-body font-medium text-foreground">
              {badge?.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
      {/* Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border/50"
      >
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)]?.map((_, i) => (
            <Icon key={i} name="Star" size={16} color="var(--color-accent)" />
          ))}
        </div>
        <blockquote className="text-lg font-body text-foreground mb-4 italic">
          "NutriFlow has completely transformed my relationship with food. The gamified cooking challenges make healthy eating fun and engaging!"
        </blockquote>
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-heading font-semibold text-primary-foreground">
              MR
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-body font-medium text-foreground">
              Maria Rodriguez
            </p>
            <p className="text-xs text-muted-foreground">
              Verified Premium User
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrustSignals;