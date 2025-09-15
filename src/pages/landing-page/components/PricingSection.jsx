import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      description: 'Perfect for getting started with basic nutrition tracking',
      price: { monthly: 0, yearly: 0 },
      badge: null,
      features: [
        'Basic meal logging',
        'Simple calorie tracking',
        '3 cooking game levels',
        'Weekly meal planning',
        'Basic nutrition insights',
        'Mobile app access',
        'Community support'
      ],
      limitations: [
        'Limited to 5 recipes per week',
        'Basic analytics only',
        'No premium cooking games'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Pro',
      description: 'Complete nutrition mastery with advanced features and personalization',
      price: { monthly: 19.99, yearly: 199.99 },
      badge: 'Most Popular',
      features: [
        'Everything in Free',
        'Unlimited meal planning',
        'Advanced macro tracking',
        'All cooking game levels',
        'AI-powered meal suggestions',
        'Detailed nutrition analytics',
        'Custom dietary profiles',
        'Priority customer support',
        'Offline recipe access',
        'Progress export & sharing',
        'Advanced goal setting',
        'Nutrition expert consultations'
      ],
      limitations: [],
      cta: 'Start Premium Trial',
      popular: true,
      savings: billingCycle === 'yearly' ? '17% off' : null
    },
    {
      id: 'family',
      name: 'Family Plan',
      description: 'Perfect for families wanting to build healthy habits together',
      price: { monthly: 29.99, yearly: 299.99 },
      badge: 'Best Value',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Family meal planning',
        'Kid-friendly cooking games',
        'Family nutrition dashboard',
        'Shared grocery lists',
        'Family challenges & rewards',
        'Parental controls',
        'Multiple dietary preferences',
        'Family progress tracking'
      ],
      limitations: [],
      cta: 'Start Family Trial',
      popular: false,
      savings: billingCycle === 'yearly' ? '17% off' : null
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Icon name="DollarSign" size={16} color="var(--color-primary)" />
            <span className="ml-2 text-sm font-medium text-primary">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Choose Your
            <span className="block text-primary">Nutrition Journey</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and upgrade anytime. All plans include our core features 
            with premium tiers offering advanced analytics and personalization.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly' ?'bg-card text-card-foreground shadow-soft' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                billingCycle === 'yearly' ?'bg-card text-card-foreground shadow-soft' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans?.map((plan) => (
            <motion.div
              key={plan?.id}
              variants={itemVariants}
              className={`relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 ${
                plan?.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan?.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    {plan?.badge}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-2">
                  {plan?.name}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {plan?.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-heading font-bold text-card-foreground">
                      ${plan?.price?.[billingCycle]}
                    </span>
                    {plan?.price?.[billingCycle] > 0 && (
                      <span className="text-muted-foreground ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  {plan?.savings && (
                    <div className="text-sm text-success font-medium mt-1">
                      {plan?.savings}
                    </div>
                  )}
                </div>

                <Link to="/user-registration">
                  <Button
                    variant={plan?.popular ? "default" : "outline"}
                    size="lg"
                    fullWidth
                    className="mb-6"
                  >
                    {plan?.cta}
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-card-foreground">
                  What's included:
                </h4>
                <ul className="space-y-3">
                  {plan?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-5 h-5 bg-success/10 rounded-full mt-0.5">
                        <Icon name="Check" size={12} color="var(--color-success)" />
                      </div>
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan?.limitations?.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h5 className="font-heading font-medium text-muted-foreground mb-3 text-sm">
                      Limitations:
                    </h5>
                    <ul className="space-y-2">
                      {plan?.limitations?.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-5 h-5 bg-muted rounded-full mt-0.5">
                            <Icon name="Minus" size={12} color="var(--color-muted-foreground)" />
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-3 bg-success/10 rounded-lg px-6 py-4">
            <Icon name="Shield" size={24} color="var(--color-success)" />
            <div className="text-left">
              <p className="font-heading font-semibold text-success">30-Day Money-Back Guarantee</p>
              <p className="text-sm text-muted-foreground">
                Try NutriFlow risk-free. Cancel anytime within 30 days for a full refund.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;