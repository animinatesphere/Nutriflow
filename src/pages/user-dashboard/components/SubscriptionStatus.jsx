import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SubscriptionStatus = ({ subscriptionData = {} }) => {
  // Provide default values to avoid destructuring errors
  const {
    tier = 'Free',
    status = 'inactive',
    expiryDate = null,
    features = [],
    usage = []
  } = subscriptionData || {};
  const isPremium = tier === 'Premium';
  const isActive = status === 'active';
  
  const daysUntilExpiry = expiryDate ? Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  const getStatusColor = () => {
    if (!isActive) return 'text-error';
    if (isExpiringSoon) return 'text-warning';
    return 'text-success';
  };

  const getStatusBg = () => {
    if (!isActive) return 'bg-error/10 border-error/20';
    if (isExpiringSoon) return 'bg-warning/10 border-warning/20';
    return 'bg-success/10 border-success/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card rounded-xl border border-border p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Subscription</h2>
        <div className={`px-3 py-1 rounded-full border ${getStatusBg()}`}>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {isPremium ? 'Premium' : 'Free'}
          </span>
        </div>
      </div>
      {isPremium ? (
        <div className="space-y-4">
          {/* Premium Status */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Icon name="Crown" size={20} color="white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-heading font-semibold text-purple-900">Premium Active</h3>
              <p className="text-sm text-purple-700">
                {isExpiringSoon 
                  ? `Expires in ${daysUntilExpiry} days`
                  : `Valid until ${new Date(expiryDate)?.toLocaleDateString()}`
                }
              </p>
            </div>
            {isExpiringSoon && (
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            )}
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            {usage?.map((item, index) => (
              <motion.div
                key={item?.feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item?.feature}</span>
                  <span className="text-xs text-muted-foreground">
                    {item?.used}/{item?.limit === -1 ? '∞' : item?.limit}
                  </span>
                </div>
                {item?.limit !== -1 && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item?.used / item?.limit) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                      className={`h-2 rounded-full ${
                        (item?.used / item?.limit) > 0.8 ? 'bg-warning' : 'bg-primary'
                      }`}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Premium Features */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Premium Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {features?.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Check" size={14} color="var(--color-success)" />
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-border">
            <Link
              to="/subscription/manage"
              className="flex-1 flex items-center justify-center space-x-2 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Icon name="Settings" size={16} />
              <span className="text-sm font-medium">Manage</span>
            </Link>
            {isExpiringSoon && (
              <Link
                to="/subscription/renew"
                className="flex-1 flex items-center justify-center space-x-2 p-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
              >
                <Icon name="RefreshCw" size={16} />
                <span className="text-sm font-medium">Renew</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Free Tier Status */}
          <div className="text-center p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="User" size={24} color="var(--color-muted-foreground)" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Free Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You're using the free version of NutriFlow with basic features
            </p>
            
            {/* Free Features */}
            <div className="space-y-2 mb-6">
              {features?.map((feature, index) => (
                <div key={feature} className="flex items-center justify-center space-x-2">
                  <Icon name="Check" size={14} color="var(--color-success)" />
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/subscription/upgrade"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-soft"
            >
              <Icon name="Crown" size={16} />
              <span className="font-medium">Upgrade to Premium</span>
            </Link>
          </div>

          {/* Premium Benefits Preview */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-medium text-purple-900 mb-2">Premium Benefits</h4>
            <div className="space-y-1">
              {[
                'AI-powered meal suggestions',
                'Advanced nutrition analytics',
                'Unlimited recipe access',
                'Priority customer support',
                'Custom meal prep guides'
              ]?.map((benefit, index) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <Icon name="Sparkles" size={12} color="var(--color-purple-500)" />
                  <span className="text-xs text-purple-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SubscriptionStatus;