import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';


const SocialRegistration = ({ onSocialRegister, isLoading }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: 'Apple',
      color: 'bg-gray-900 hover:bg-black',
      textColor: 'text-white'
    }
  ];

  const handleSocialClick = (provider) => {
    onSocialRegister(provider);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {socialProviders?.map((provider) => (
          <motion.button
            key={provider?.id}
            onClick={() => handleSocialClick(provider)}
            disabled={isLoading}
            className={`
              flex items-center justify-center px-4 py-3 rounded-lg border border-border
              transition-all duration-200 hover:shadow-soft
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              bg-card hover:bg-muted
            `}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <Icon 
              name={provider?.icon} 
              size={20} 
              className="mr-2 text-muted-foreground" 
            />
            <span className="font-body font-medium text-foreground">
              {provider?.name}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </motion.div>
  );
};

export default SocialRegistration;