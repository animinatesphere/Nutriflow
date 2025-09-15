import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessMessage = ({ userEmail, onResendVerification, isResending }) => {
  const nextSteps = [
    {
      icon: 'Mail',
      title: 'Check Your Email',
      description: `We've sent a verification link to ${userEmail}. Click the link to activate your account.`,
      color: 'text-primary'
    },
    {
      icon: 'Shield',title: 'Verify Your Account',description: 'Email verification helps keep your account secure and ensures you receive important updates.',color: 'text-success'
    },
    {
      icon: 'Rocket',title: 'Start Your Journey',description: 'Once verified, you can access your dashboard and begin tracking your nutrition goals.',color: 'text-accent'
    }
  ];

  return (
    <motion.div
      className="text-center space-y-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Success Icon */}
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={40} color="white" />
        </div>
      </motion.div>
      {/* Success Message */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Welcome to NutriFlow!
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your account has been created successfully. We're excited to help you achieve your nutrition goals!
        </p>
      </motion.div>
      {/* Next Steps */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-heading font-semibold text-foreground">
          What's Next?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nextSteps?.map((step, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4`}>
                <Icon name={step?.icon} size={24} className={step?.color} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                {step?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step?.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Email Verification Section */}
      <motion.div
        className="bg-muted rounded-lg p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span className="text-sm">Didn't receive the email? Check your spam folder or</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResendVerification}
          loading={isResending}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Resend Verification Email
        </Button>
      </motion.div>
      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Button
          variant="default"
          size="lg"
          iconName="ArrowRight"
          iconPosition="right"
          asChild
        >
          <Link to="/user-login">
            Continue to Login
          </Link>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          iconName="Home"
          iconPosition="left"
          asChild
        >
          <Link to="/landing-page">
            Back to Home
          </Link>
        </Button>
      </motion.div>
      {/* Additional Help */}
      <motion.div
        className="text-center pt-6 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-sm text-muted-foreground mb-2">
          Need help getting started?
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <Link to="/help" className="text-primary hover:text-primary/80 underline">
            Help Center
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/contact" className="text-primary hover:text-primary/80 underline">
            Contact Support
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessMessage;